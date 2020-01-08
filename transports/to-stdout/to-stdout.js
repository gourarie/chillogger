const color = require("./color");
const {EOL} = require("os");

function padRight(input, count, char) { return ((input + char.repeat(count))).substring(0, count); }
function padLeft(input, count, char) { return ((char.repeat(count) + input)).slice(-1 * count); }

function formatDate(ts) {
    let [match,yy,mm,dd,t,ms] = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:]{8})\.([0-9]{3})/.exec(new Date(ts).toISOString());
    let timeString = `${yy}${mm}${dd} ${t}${process.env.trace ? `.${ms}` : ''}`
    return timeString;
}

const pidPlaceHolderLength = 15;
const messageIdPlaceHolderSpace = 24;
const messageIdPlaceHolder = " ".repeat(messageIdPlaceHolderSpace);
const logLevelSpace = 10;



module.exports = function writeToConsole(msg, level) {
    if (!level || !msg) {
        let error = new Error("not enugth data");
        console.log(color(error.stack,"RED"));
        return
    } 
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
        line += color(`| ${msg.src.file}:${msg.src.line} `, "WHITE");
        // line += color(" " + msg.src.caller + " ", level.srcColor);
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