const LogMessageTransformer = require("./_log-message-transformer.js");
const color = require("./color");
const levels = require("./_log-levels.js");
const {EOL} = require("os")



function padRight(input, count, char) { return ((input + char.repeat(count))).substring(0, count); }
function padLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

function formatDate(ts) {
    let [match,yy,mm,dd,t,ms] = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:]{8})\.([0-9]{3})/.exec(new Date(ts).toISOString());
    let timeString = `${yy}${mm}${dd} ${t}${process.env.trace ? `.${ms}` : ''}`
    return timeString;
}

const pidPlaceHolderLength = 15;
const messageIdPlaceHolderSpace = 24
const messageIdPlaceHolder = " ".repeat(messageIdPlaceHolderSpace);
const logLevelSpace = 10

function writeToConsole(msg, level) {
    if (level.level > process.env.consoleLogLevel) return;
    var line = color(padRight(msg.level, logLevelSpace, " "), level.labelColor);
    let metaPrefixLength = logLevelSpace + 4;
    let dateString = formatDate(msg.ts);
    metaPrefixLength += dateString.length + messageIdPlaceHolderSpace + 3;
    line += color(` : ${dateString} | `,"WHITE");
    
    line += color(msg.cc ? padRight(msg.cc,messageIdPlaceHolderSpace, " ") : messageIdPlaceHolder, "GREEN") + " ";
    if (msg.pids) {
        line += color(padLeft(msg.pids+" ", pidPlaceHolderLength ," "), "PURPLE");
        metaPrefixLength +=pidPlaceHolderLength;
    }
    if (msg.src) {
        line += color(`| ${msg.src.file}:${msg.src.line} |`, "WHITE");
        line += color(" " + msg.src.caller + " ", level.srcColor);
    }
    let metaPrefix = color(" ".repeat(metaPrefixLength)+"| ","GRAY");
    line += color("| ", "WHITE");
    line += color(msg.msg,level.messageColor);
    line += EOL;
    
    for (var i = 0; i < msg.meta.length; i++) { 
        line += metaPrefix;
        line += color(typeof(msg.meta[i]) == "string" ? msg.meta[i] : JSON.stringify(msg.meta[i]), level.metaColor)+ EOL
    }
    process.stdout.write(line);
}

const NS_PER_SEC = 1e9;

module.exports = function (correlate, transport = writeToConsole, logLevels = levels) {
    var _transformer = LogMessageTransformer(correlate, logLevels);
    var _producer = function (level, msg, beAProxy) {
        if (beAProxy) {
            return transport(msg, level);
        }
        if (level === undefined) return
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

module.exports.trace = function(){
    process.env.trace = true;
}
module.exports.stopTrace = function(){
    process.env.trace = false;
}

process.env.consoleLogLevel = levels.info.level;
module.exports.consoleLevel = function(newLevel){
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