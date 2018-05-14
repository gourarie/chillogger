
const levels = require("./_log-levels.js");
const LogMessageTransformer = require("./_log-message-transformer.js");
const color = require("./color");
    
function paddRight(input, count, char) { return ((input + char.repeat(count))).substring(0, count); }
function paddLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

function formatDate(ts) {
    var _ds = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:.]{12})/.exec(new Date(ts).toISOString());
    return `${_ds[1]}${_ds[2]}${_ds[3]} ${_ds[4]}`;
}

const idColW = 40;

function writeToConsole(msg) {
    let level = levels[msg.level];
    var line = color(paddRight(msg.level, 10, " "), level.labelColor);
    line += color(` : ${formatDate(msg.ts)} | `,"WHITE");
    line += color((msg.cc ? `${msg.cc.padEnd(24).substring(0,24)} ` : `${" ".repeat(25)}`), "GREEN");
    line += color(paddLeft(msg.pids+" ", idColW - 25," "), "PURPLE");
    if (msg.src) {
        line += color(`| ${msg.src.file}:${msg.src.line} |`, "WHITE");
        line += color(" " + msg.src.caller + " ", level.srcColor);
    }
    line += color("|", "WHITE");
    line += color(" " + msg.msg + " ", level.messageColor);
    console.log(line);
    msg.meta.forEach(function (item) {
        line = typeof(item) == "string" ? item : JSON.stringify(item);
        console.log(color(`${(" ".repeat(idColW + 35))}| ${line}`, level.metaColor));
    });
}

const NS_PER_SEC = 1e9;

module.exports = function (correlate, transport = writeToConsole) {
    var _transformer = LogMessageTransformer(correlate);
    var _producer = function (level, msg) {
        if (level === undefined) return
        var _msg = _transformer(level, msg);
        transport(_msg);
    }
    Object.defineProperties(_producer, {
        meta: {
            set: function (value) { _transformer.meta = value }
        },
        id: {
            value: _transformer.id
        },
        timeline: {
            value: {}
        },
        time: {
            value: function time(label = "main") {
                _producer.timeline[label] = _transformer.timeStamp()
            }
        },
        timeEnd: {
            value: function timeEnd(label = "main") {
                if (_producer.timeline[label]) {
                    let timeEndInfo = _transformer.timeStamp(_producer.timeline[label].ts, _producer.timeline[label].srcInfo);
                    let timeDif = Math.round((timeEndInfo.ts[0] * NS_PER_SEC + timeEndInfo.ts[1])/1000)/1000;
                    timeEndInfo.message = `${label}: ${timeDif}ms `;
                    _producer("time", timeEndInfo);
                }
            }
        }
    });
    return _producer;
};