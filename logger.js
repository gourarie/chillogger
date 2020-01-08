const LogMessageTransformer = require("./_log-message-transformer.js");
const writeToConsole = require("./transports").toStdOut;
const levels = require("./_log-levels.js");
const NS_PER_SEC = 1e9;


process.env.level = 3;
console.log(process.env.level)

const Logger = function (correlate, transport = writeToConsole, logLevels = levels) {
    var _transformer = LogMessageTransformer(correlate, logLevels);
    var _producer = function (level, msg, beAProxy) {
        if (beAProxy) {
            return transport(msg, level);
        }
        if (level === undefined) return
        if (!logLevels[level]) level = "debug";
        if (logLevels[level].level > process.env.level) return;
        var _msg = _transformer(level, msg);
        transport(_msg, logLevels[_msg.level]);
    }

    Object.defineProperties(_producer, {
        meta: {
            set: function (value) { _transformer.meta = value }
        },
        id: {
            value: _transformer.id
        }
    })
    

    const timeTraceStart = function time(label = "main",stackLinesToSkip = 0) {
        _producer.timeline[label] = _transformer.timeStamp(undefined,undefined,stackLinesToSkip)
    }
    const timeTraceEnd = function timeEnd(label = "main") {
        if (_producer.timeline[label]) {
            let timeEndInfo = _transformer.timeStamp(_producer.timeline[label].ts, _producer.timeline[label]);
            let timeDif = Math.round((timeEndInfo.ts[0] * NS_PER_SEC + timeEndInfo.ts[1])/1000)/1000;
            timeEndInfo.message = `${label}: ${timeDif}ms `;
            _producer("time", timeEndInfo);
        }
    }
    const nullFunction = function(){}

    Object.defineProperties(_producer, {
        timeline: {
            value: {}
        },
        time: {
            get:function(){
                return process.env.trace ? timeTraceStart : nullFunction
            }
            
        },
        timeEnd: {
            get: function(){
                return process.env.trace ? timeTraceEnd : nullFunction
            }
        }
    });
    _producer.time("main",1);
    return _producer;
};

Logger.trace = function(){
    process.env.trace = true;
}
Logger.stopTrace = function(){
    process.env.trace = false;
}

process.env.consoleLogLevel = process.env.consoleLogLevel || levels.info.level;

Logger.consoleLevel = function(newLevel){
    switch (typeof(newLevel)) {
        case "string":
            process.env.consoleLogLevel = (levels[newLevel] || {level: process.env.consoleLogLevel}).level
            break;
        case "number": 
            process.env.consoleLogLevel =  newLevel;
            break;
        default:
            break;
    }
}

Logger.consoleTransport = writeToConsole;

module.exports = Logger