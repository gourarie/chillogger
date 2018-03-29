const logLevels = require("./_log-levels.js"),
    hostname = {host: require("os").hostname()},
    {ObjectID} = require('mongodb');

Error.stackTraceLimit = 10;
const level = "debug",
    debug = true;

function fromCamelCase(inputString) {
    return inputString.replace(/[A-Z]+/g, function (_match) {
        return ` ${_match.toLowerCase()}`
    }).trim()
}

var parseStack = function parseStack(stack, skip = 0) {
    var expression = /at ([\.a-zA-Z0-9\[\]\<\>]*).*(?:[\/\\](?:([a-z0-9\-._]*)\:([0-9]*)\:))/g;
    var stackInfo;
    for (var i = 0; i < skip; i++){ stackInfo = expression.exec(stack); }
    stackInfo = expression.exec(stack);
    if (stackInfo) {
        return {
            file: stackInfo[2],
            caller: fromCamelCase(stackInfo[1].split(".").pop()),
            line: stackInfo[3]
        };
    }
    else {
        return {
            file: "Unknown",
            caller: "Anonymous function, need to give this function a name",
            line: "Unknown",
            stack: stack
        };
    }
}

class ResponseError{
    constructor (message){
        if (message instanceof Error) {
            this.message = message.message;
            this.code = 500,
            this.userMessage = "Server fault";
            this.level = "error";
            this.origin = "error";
            if (debug) {
                this.stack = message.stack;
                this.src = parseStack(message.stack,0);
            }
        } else {
            this.message = message;
            if (debug) {
                Error.captureStackTrace(this, this.caller);
                this.src = parseStack(this.stack,1);
            }
        }
    }
    message(message) {
        this.message = message
        return this
    }
    error (error) {
        this.error = error
        return this
    }
    code(code){
        this.code = code
        return this
    }
    level(level){
        this.level = level
        return this
    }
    userMessageCode(userMessageCode){
        this.userMessageCode = userMessageCode
        return this
    }
    userMessage(userMessage){
        this.userMessage = userMessage
        return this
    }
}

function mid(message) {
    return `${message.id}${message.sn}#${message.wid}`
}

function paddLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

module.exports = function LogMessageTransformer(correlate) {
    var _meta = [];
    var corrCode = correlate ? 
        (correlate instanceof ObjectID) ? correlate : new ObjectID() 
        : undefined;
    let pids = [process.env.sn || "system", paddLeft(process.env.swid || "",2,"0") || "00"] 
        .filter(function (item) { return item })
        .join("#"); //producer id string
    
    var _log = function log(arg1, srcMsg) {
        var _msg = {
            meta: _meta,
            ts: Date.now(),
            pids: pids,
            cc: corrCode
        };

        switch (true) {
            case arg1 instanceof ResponseError:{
                _msg.msg = arg1.message;
                _msg.level = arg1.level;
                _msg.src = arg1.src;
                _msg.meta = ((arg1.origin === "error") ? [arg1.stack] : []).concat(_meta);
                _meta = [];
                break
            }
            case arg1 instanceof Error:
                _msg.meta = [arg1.stack];
                _msg.msg = arg1.message;
                _msg.level = "error";
                break;
            case srcMsg instanceof Error:
                _msg.meta = [srcMsg.stack];
                _msg.msg = srcMsg.message;
                _msg.level = arg1;
                break;
            case !srcMsg:
                _msg.msg = arg1;
                _msg.level = level;
                _msg.meta = _meta;
                _meta = [];
                break;
            default: 
                _msg.msg = srcMsg;
                _msg.level = logLevels[arg1] ? arg1 : level;
                _msg.meta = _meta
                _meta = [];
        }

        if (debug && !_msg.src) {
            Error.captureStackTrace(_msg,log.caller);
            _msg.src = parseStack(_msg.stack);
        }
        Object.assign(_msg, hostname);
        return _msg;
    }

    Object.defineProperties(_log, {
        meta: {
            get: function () { return _meta },
            set: function (value) { if (value) _meta.push(value) }
        },
        id: {
            value: corrCode
        }
    });

    return _log;
}