const hostname = { host: require("os").hostname() };
const crypto = require("crypto");
LogId = function () {
    let logId = (Number(Date.now()).toString(16) + crypto.prng(7).toString("hex")).toUpperCase();
    return logId.slice(1)
}

Error.stackTraceLimit = 10;
const defaultLevel = "debug";

var parseStack = function parseStack(stack, skip = 0) {
    var expression = /at ([\.a-zA-Z0-9\[\]\<\>]*).*(?:[\/\\](?:([a-z0-9\-._]*)\:([0-9]*)\:))/g;
    for (var i = 0; i < skip; i++) { expression.exec(stack); }
    try {
        let [match, caller, file, line] = expression.exec(stack);
        return {
            file: file,
            caller: caller.split(".").pop(),
            line: line
        };
    } catch (error) {
        return {
            file: "Unknown",
            caller: "Anonymous function, need to give this function a name",
            line: "Unknown",
            stack: stack
        };
    }
}

function padLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

const LogMessageTransformer = function LogMessageTransformer(correlate, logLevels) {
    var _meta = [];
    var corrCode;
    switch (true) {
        case typeof (correlate) === "string":
            corrCode = correlate;
            break;
        case typeof (correlate) === "boolean":
            corrCode = LogId()
            break;
        default:
            corrCode = undefined;
            break;
    };

    let pids = process.env.sn ? [process.env.sn, padLeft(process.env.swid || "", 2, "0") || "00"]
        .filter(function (item) { return item })
        .join("#") : ""; //producer id string

    function logLevel(level) {
        return logLevels[level] ? level : defaultLevel
    }

    var _log = function log(arg1, srcMsg) {
        var _msg = {
            ts: Date.now(),
            pids: pids,
            cc: corrCode
        };

        switch (true) {
            case arg1 instanceof Error:
                _msg.meta = [arg1.stack];
                _msg.msg = arg1.message;
                _msg.level = "error";
                break;
            case srcMsg instanceof Error:
                _msg.meta = [srcMsg.stack];
                break;
            case typeof (arg1) === "object":
                _msg.src = _msg.stack ? parseStack(_msg.stack) : null;
                _msg.msg = arg1.message || JSON.stringify(arg1);
                _msg.level = arg1.stack ? logLevel("error") : defaultLevel;
                break;
            case typeof (srcMsg) === "object":
                _msg.src = _log.trace ? (srcMsg.src || srcMsg.stack ? parseStack(srcMsg.stack) : null) : "";
                _msg.msg = srcMsg.message || JSON.stringify(srcMsg);
                _msg.level = logLevel(arg1);
                break;
            case !srcMsg:
                _msg.msg = arg1;
                _msg.level = defaultLevel;
                break;
            default:
                _msg.msg = srcMsg;
                _msg.level = logLevel(arg1);
        }
        _msg.meta = (_msg.meta || []).concat(_meta);
        _meta = [];

        if (_log.trace && !_msg.src) {
            if (!_msg.stack) Error.captureStackTrace(_msg, log.caller);
            _msg.src = parseStack(_msg.stack);
        }
        Object.assign(_msg, hostname);
        return _msg;
    }

    Object.defineProperties(_log, {
        trace: {
            get: function () {
                return process.env.trace
            }
        },
        meta: {
            get: function () { return _meta },
            set: function (value) { if (value) _meta.push(value) }
        },
        id: {
            value: corrCode
        },
        timeStamp: {
            value: function timeStamp(baseTs, eventOriginInfo, stackLinesToSkip = 0) {
                let lebalObject = {
                    ts: process.hrtime(baseTs)
                }
                if (_log.trace) {
                    Error.captureStackTrace(lebalObject, timeStamp.caller);
                    lebalObject.src = parseStack(lebalObject.stack, stackLinesToSkip);

                    if (eventOriginInfo) {
                        _log.meta = { origin: `${eventOriginInfo.src.file}:${eventOriginInfo.src.line} | ${eventOriginInfo.src.caller}` }
                    }
                }
                return lebalObject
            }
        }
    });

    return _log;
}

module.exports = LogMessageTransformer;