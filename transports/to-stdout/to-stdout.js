const color = require("./color");
const { EOL } = require("os");

function padRight(input, count, char) {
  return (input + char.repeat(count)).substring(0, count);
}
function padLeft(input, count, char) {
  return (char.repeat(count) + input).slice(-1 * count);
}

function formatDate(ts) {
  let [
    match,
    yy,
    mm,
    dd,
    t,
    ms
  ] = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:]{8})\.([0-9]{3})/.exec(
    new Date(ts).toISOString()
  );
  let timeString = `${yy}${mm}${dd} ${t}${process.env.trace ? `.${ms}` : ""}`;
  return timeString;
}

const pidPlaceHolderLength = 15;
const messageIdPlaceHolderSpace = 24;
const messageIdPlaceHolder = " ".repeat(messageIdPlaceHolderSpace);
const logLevelSpace = 10;

module.exports = function writeToConsole({
  name,
  message,
  meta = [],
  level: { level, messageColor, labelColor, srcColor, metaColor },
  levelName,
  ts,
  src
}) {
  var line = color(padRight(levelName, logLevelSpace, " "), labelColor);
  let metaPrefixLength = logLevelSpace + 4;
  let dateString = formatDate(ts);
  metaPrefixLength += dateString.length + messageIdPlaceHolderSpace + 3;
  line += color(` : ${dateString} | `, "WHITE");

  line +=
    color(
      name
        ? padRight(name, messageIdPlaceHolderSpace, " ")
        : messageIdPlaceHolder,
      "GREEN"
    ) + " ";
  if (src) {
    line += color(`| ${src.file}:${src.line} `, "WHITE");
    // line += color(" " + msg.src.caller + " ", level.srcColor);
  }
  let metaPrefix = color(" ".repeat(metaPrefixLength) + "| ", "GRAY");
  line += color("| ", "WHITE");
  line += color(message, messageColor);
  line += EOL;

  for (var i = 0; i < meta.length; i++) {
    line += metaPrefix;
    line +=
      color(
        typeof meta[i] == "string"
          ? meta[i]
          : JSON.stringify(meta[i]),
        metaColor
      ) + EOL;
  }
  process.stdout.write(line);
};
