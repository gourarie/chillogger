
const hostname = require("os").hostname(),
    LogMessageTransformer = require("./_log-message-transformer.js"),
    levels = require("./_log-levels.js"),
    color = require("./color");
    
function paddRight(input, count, char) { return ((input + char.repeat(count))).substring(0, count); }
function paddLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

function formatDate(ts) {
    var _ds = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:.]{12})/.exec(new Date(ts).toISOString());
    return `${_ds[1]}${_ds[2]}${_ds[3]} ${_ds[4]}`;
}

const idColW = 40;

function writeToConsole(msg) {
    var line = color(paddRight(msg.level, 10, " "), levels[msg.level].color);
    line += color(` : ${formatDate(msg.ts)} | `, "WHITE");
    line += color((msg.cc ? `${msg.cc} ` : `${" ".repeat(25)}`), "LIGHT_BLUE");
    line += color(paddLeft(msg.pids+" ", idColW - 25," "), "PURPLE");
    if (msg.src) {
        line += color(`| ${msg.src.file}:${msg.src.line} |`, "WHITE");
        line += color(" " + msg.src.caller + " ", "WHITE_ON_BLUE");
    }
    line += color("|", "WHITE");
    line += color(" " + msg.msg + " ", msg.level === "error" ? "LIGHT_RED" : (msg.level === "alert") ? "WHITE_ON_RED" : "WHITE");
    console.log(line);
    msg.meta.forEach(function (item) {
        line = typeof(item) == "string" ? item : JSON.stringify(item);
        console.log(color(`${(" ".repeat(idColW + 35))}| ${line}`, msg.level === "error" ? "LIGHT_RED" : "GRAY"));
    });
}


module.exports = function (correlate, transport = writeToConsole) {
    var _transformer = LogMessageTransformer(correlate);
    var _producer = function (level, msg) {
        if (level === undefined) return
        var _msg = _transformer(level, msg);
        transport(_msg, `log.${hostname}.${_msg.level}`);
    }
    Object.defineProperties(_producer, {
        meta: {
            set: function (value) { _transformer.meta = value }
        },
        id: {
            value: _transformer.id
        }
    });
    return _producer;
};