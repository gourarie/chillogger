const writeToConsole = require("./transports").toStdOut;
const levels = require("./_log-levels.js");
const NS_PER_SEC = 1e9;
const crypto = require("crypto");
const hrtime = require('browser-process-hrtime');


const LogId = () => {
    let logId = (Number(Date.now()).toString(16) + crypto.prng(7).toString("hex")).toUpperCase();
    return logId.slice(1)
}

var parseStack = function parseStack(stack, skip = 0) {
    var expression = /at .*(?:[\/\\](?:([a-z0-9\-._]*)\:([0-9]*)\:))/g;
    for (var i = 0; i < skip; i++) { expression.exec(stack); }
    try {
        let [match, /*caller,*/ file, line] = expression.exec(stack);
        return {
            file: file,
            line: line
        };
    } catch (error) {
        return {
            file: "Unknown",
            line: "Unknown",
            stack: stack
        };
    }
}

// const LogMessageTransformer = require("./_log-message-transformer.js");
// const hostname = { host: require("os").hostname() };


process.env.level = 3;
process.env.trace = 1;

module.exports = class Logger {
    constructor (name, customLevels = levels, transport = writeToConsole) {
        switch (true) {
            case typeof (name) === "string":
                this.name = name
                break;
            case typeof (name) === "boolean":
                this.name = LogId()
                break;
            default:
                break;
        };
        this.levels = customLevels;
        this.transport = transport;
        
        Object.keys(this.levels).forEach(level=>{
            if (this[level]) return;

            Object.defineProperty(this,level,{
                value:this.log.bind(this,level)
            })
        })
        this.timetrackers = {};
        // Object.defineProperties()
    }

    tranform(levelName, tracker, message, ...meta) {
        if (!this.levels[levelName] && !levels[levelName]) {
            levelName = "debug"
        }
        let level = this.levels[levelName] || levels[levelName];
        

        return {
            name: this.name,
            message,
            meta,
            level,
            levelName,
            ts: Date.now(),
            src:  process.env.trace ? parseStack(tracker.stack,1) : undefined
        }
    }

    dispatch(message) {
        if (message.level.level > process.env.level) return
        this.transport(message)
        return this;
    }

    error(error){
        if (error) {
            this.dispatch(this.tranform("error", error, error.message, process.env.trace ? error.stack : undefined))
            
        }
    }
    log(level, message,...meta){
        const tracker = {};
        Error.captureStackTrace(tracker,1);
        this.dispatch(this.tranform(level, tracker, message, ...meta))
    }

    time (label){
        if (!process.env.trace) reutnr
        var tracker = {}
        Error.captureStackTrace(tracker);
        this.timetrackers[label] = {
            ...parseStack(tracker.stack,1),
            ts: hrtime()
        }
    }
    timeEnd (label){
        try {
            let {file,line,ts} = this.timetrackers[label]
            let diff = Math.round((ts[0] * NS_PER_SEC + ts[1])/1000)/1000;    
            this.log("time",`${label}: ${diff}`,`Origin: ${file}:${line}`)
        } catch (error) {
            console.log(error)   
        }
        

    }
}

// const Logger = function (correlate, logLevels = levels, transport = writeToConsole) {
//     var _transformer = LogMessageTransformer(correlate, logLevels);
//     var _producer = function (level, msg, beAProxy) {
//         if (beAProxy) {
//             return transport(msg, level);
//         }
//         if (level === undefined) return
//         if (!logLevels[level]) level = "debug";
//         var _msg = _transformer(level, msg);
//         console.log(msg)
//         transport(_msg, logLevels[_msg.level]);
//     }

//     Object.defineProperties(_producer, {
//         meta: {
//             set: function (value) { _transformer.meta = value }
//         },
//         id: {
//             value: _transformer.id
//         }
//     })
    

//     const timeTraceStart = function time(label = "main",stackLinesToSkip = 0) {
//         _producer.timeline[label] = _transformer.timeStamp(undefined,undefined,stackLinesToSkip)
//     }
//     const timeTraceEnd = function timeEnd(label = "main") {
//         if (_producer.timeline[label]) {
//             let timeEndInfo = _transformer.timeStamp(_producer.timeline[label].ts, _producer.timeline[label]);
//             let timeDif = Math.round((timeEndInfo.ts[0] * NS_PER_SEC + timeEndInfo.ts[1])/1000)/1000;
//             timeEndInfo.message = `${label}: ${timeDif}ms `;
//             _producer("time", timeEndInfo);
//         }
//     }
//     const nullFunction = function(){}

//     Object.defineProperties(_producer, {
//         timeline: {
//             value: {}
//         },
//         time: {
//             get:function(){
//                 return process.env.trace ? timeTraceStart : nullFunction
//             }
            
//         },
//         timeEnd: {
//             get: function(){
//                 return process.env.trace ? timeTraceEnd : nullFunction
//             }
//         }
//     });
//     _producer.time("main",1);
//     return _producer;
// };

// Logger.trace = function(){
//     process.env.trace = true;
// }
// Logger.stopTrace = function(){
//     process.env.trace = false;
// }

// process.env.consoleLogLevel = process.env.consoleLogLevel || levels.info.level;

// Logger.consoleLevel = function(newLevel){
//     switch (typeof(newLevel)) {
//         case "string":
//             process.env.consoleLogLevel = (levels[newLevel] || {level: process.env.consoleLogLevel}).level
//             break;
//         case "number": 
//             process.env.consoleLogLevel =  newLevel;
//             break;
//         default:
//             break;
//     }
// }

// Logger.consoleTransport = writeToConsole;

// module.exports = Logger