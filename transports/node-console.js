const EOL = "\n";

const levelColors = {
  fatal: {
    messageColor: "RED",
    labelColor: "WHITE_ON_RED",
    metaColor: "RED"
  },
  alert: {
    messageColor: "RED",
    labelColor: "WHITE_ON_RED",
    srcColor: "WHITE_ON_RED",
    metaColor: "YELLOW"
  },
  error: {
    messageColor: "WHITE",
    labelColor: "RED",
    srcColor: "DARK_RED",
    metaColor: "DARK_RED"
  },
  warn: {
    messageColor: "DARK_YELLOW",
    labelColor: "YELLOW",
    srcColor: "DARK_YELLOW"
  },
  section: {
    messageColor: "DARK_PURPLE_ON_GRAY",
    labelColor: "DARK_GREEN_ON_GRAY",
    nameColor: "BLACK_ON_GRAY",
    srcColor: -1,
    tsColor: -1,
  },
  info: {
    level: 3,
    labelColor: "GREEN",
  },
  time: {
    messageColor: "PURPLE",
    labelColor: "WHITE_ON_PURPLE",
  },
  debug: {
    labelColor: "PURPLE",
  },
  todo: {
    labelColor: "WHITE_ON_GREEN",
    
  },
  deprecated: {
    labelColor: "YELLOW_ON_YELLOW",
  }
};

const _colors = {
  WHITE: "\u001b[1;40;37m",
  RESET: "\u001b[0m",
  DEFAULT: "\u001b[0m\u001b[1m",
  GRAY: "\u001b[0;40;37m",
  DARK_GRAY: "\u001b[1;40;30m",
  RED: "\u001b[1;40;31m",
  DARK_RED: "\u001b[0;40;31m",
  GREEN: "\u001b[1;40;32m",
  DARK_GREEN: "\u001b[0;40;32m",
  BLUE: "\u001b[1;40;34m",
  PURPLE: "\u001b[1;40;35m",
  TURQUOISE: "\u001b[1;40;36m",
  DARK_TURQUOISE: "\u001b[0;40;36m",
  YELLOW: "\u001b[1;40;33m",
  DARK_YELLOW: "\u001b[0;40;33m",
  //RED background
  WHITE_ON_RED: "\u001b[1;41;37m",
  TURQUOISE_ON_RED: "\u001b[1;41;36m",
  YELLOW_ON_RED: "\u001b[1;41;33m",
  GREEN_ON_RED: "\u001b[1;41;32m",
  //GREEN background
  YELLOW_ON_GREEN: "\u001b[1;42;33m",
  WHITE_ON_GREEN: "\u001b[1;42;37m",
  //YELLOW background
  YELLOW_ON_YELLOW: "\u001b[1;43;33m",
  GREEN_ON_YELLOW: "\u001b[1;43;32m",
  BLUE_ON_YELLOW: "\u001b[1;43;34m",
  //BLUE background
  WHITE_ON_BLUE: "\u001b[1;44;37m",
  GRAY_ON_BLUE: "\u001b[1;44;30m",
  RED_ON_BLUE: "\u001b[1;44;31m",
  GREEN_ON_BLUE: "\u001b[1;44;32m",
  YELLOW_ON_BLUE: "\u001b[1;44;33m",
  PURPLE_ON_BLUE: "\u001b[1;44;35m",
  //PURPLE background
  WHITE_ON_PURPLE: "\u001b[1;45;37m",
  YELLOW_ON_PURPLE: "\u001b[1;45;33m",
  GREEN_ON_PURPLE: "\u001b[1;45;32m",
  TURQUOISE_ON_PURPLE: "\u001b[1;45;36m",
  //TURQUOISE backgound
  BLACK_ON_TURQUOISE: "\u001b[0;46;30m",
  GREEN_ON_TURQUOISE: "\u001b[1;46;32m",
  YELLOW_ON_TURQUOISE: "\u001b[1;46;33m",
  GRAY_ON_TURQUOISE: "\u001b[0;46;37m",
  WHITE_ON_TURQUOISE: "\u001b[1;46;37m",
  BLACK_ON_GRAY: "\u001b[0;47;30m",
  //GRAY background
  RED_ON_GRAY: "\u001b[1;47;31m",
  DARK_RED_ON_GRAY: "\u001b[0;47;31m",
  DARK_GREEN_ON_GRAY: "\u001b[0;47;32m",
  YELLOW_ON_GRAY: "\u001b[1;47;33m",
  BLUE_ON_GRAY: "\u001b[1;47;34m",
  DARK_BLUE_ON_GRAY: "\u001b[0;47;34m",
  PURPLE_ON_GRAY: "\u001b[1;47;35m",
  DARK_PURPLE_ON_GRAY: "\u001b[0;47;35m",
  DARK_TURQUOISE_ON_GRAY: "\u001b[0;47;36m"
};

const color = function(input, _color) {
  if (_color === -1) return "";
  _color = _color || "DEFAULT";
  return _colors[_color.toUpperCase()] + input + _colors.RESET;
};

function dateString(ts, verbosity) {
  let [
    match,
    yyyy,
    mm,
    dd,
    t,
    ms
  ] = /[0-9]{2}([0-9]{2})-([0-9]{2})-([0-9]{2})T([0-9:]{8})\.([0-9]{3})/.exec(
    new Date(ts).toISOString()
  );

  switch (verbosity) {
    case VERBOSITY_LEVELS.VERBOSE:
      return `${t}.${ms}`;
    case VERBOSITY_LEVELS.VERY_VERBOSE:
      return `${yyyy}${mm}${dd} ${t}.${ms}`;
    default:
      return "";
  }
}

function dateLength(verbosity) {
  switch (verbosity) {
    case VERBOSITY_LEVELS.VERBOSE:
      return 30;
    case VERBOSITY_LEVELS.VERY_VERBOSE:
      return 25;
    default:
      return 3;
  }
}

const logLevelSpace = 10;

const VERBOSITY_LEVELS = {
  ANY: 0,
  VERBOSE: 1,
  VERY_VERBOSE: 2
};

function withVerbosityPrinter(verbosityLevel, verbosity, string) {
  return verbosity >= verbosityLevel ? string : "";
}

function splitFunctionSourceCode(srouceCode) {
  return srouceCode
    .toString()
    .replace(/(\r$)|(\r\n)|(\n)/g, "\n")
    .replace(/\n\n/g, "\n")
    .split("\n");
}

function expandMeta(meta, metaPrefixLength, metaColor, verbosity) {
  var line = "";
  switch (typeof meta) {
    case "function":
      if (verbosity < VERBOSITY_LEVELS.VERY_VERBOSE) {
        let sourceCodeLines = splitFunctionSourceCode(meta);
        line =
          " ".repeat(metaPrefixLength) +
          color(
            sourceCodeLines[0] + (sourceCodeLines[1] ? "..." : "") + EOL,
            "DARK_YELLOW"
          );
      } else {
        line =
          " ".repeat(metaPrefixLength) +
          color(
            meta
              .toString()
              .replace(/\n/g, "\n" + " ".repeat(metaPrefixLength) + "\t"),
            "DARK_YELLOW"
          ) +
          EOL;
      }
      break;
    case "boolean":
    case "string":
    case "number":
      line = " ".repeat(metaPrefixLength) + color(meta, metaColor) + EOL;
      break;
    case "object":
      if (!Object.keys(meta).length) break;
      JSON.stringify(
        meta,
        (key, value) => {
          if (typeof value === "function") {
            if (verbosity < VERBOSITY_LEVELS.VERY_VERBOSE)
              return (
                "~chillogger~function~print~" +
                splitFunctionSourceCode(value).shift() +
                "...~chillogger~function~print~end~"
              );
            return (
              splitFunctionSourceCode(value)
                .map(i => `~chillogger~function~print~${i}`)
                .join("~chillogger~nlf~") + "~chillogger~function~print~end~"
            );
          }
          return value;
        },
        `\t`
      )

        .replace(
          /~chillogger~function~print~end~/g,
          `${_colors.RESET}${_colors[metaColor]}`
        )
        .replace(
          /~chillogger~function~print~/g,
          `${_colors.RESET}${_colors.DARK_YELLOW}`
        )
        .replace(/~chillogger~nlf~/g, "\n" + " ".repeat(metaPrefixLength))
        .split("\n")
        .forEach((part, index, array) => {
          line += " ".repeat(metaPrefixLength) + color(part, metaColor) + EOL;
        });
    default:
      break;
  }
  return line;
}

function getColorsByLevel(levelLabel) {
  let {
    messageColor = "WHITE",
    labelColor = "PURPLE",
    nameColor = "GREEN",
    srcColor = "DARK_GRAY",
    tsColor = "GRAY",
    metaColor = "DARK_GRAY"
  } = levelColors[levelLabel] || {};
  return {
    messageColor,
    labelColor,
    nameColor,
    srcColor,
    tsColor,
    metaColor
  };
}

var logLinePartsTransformers = {
  //order matters!
  levelLabel: (key, levelLabel, fullMessage) => {
    return color(
      levelLabel.padEnd(logLevelSpace),
      getColorsByLevel(levelLabel).labelColor
    );
  },
  ts: (key, ts, {levelLabel}, { verbosity }) => {
    let { tsColor } = getColorsByLevel(levelLabel);
    return color(dateString(ts, verbosity),tsColor);
  },
  name: (key, name, {levelLabel}, { verbosity }) => {
    let { nameColor } = getColorsByLevel(levelLabel);
    switch (true) {
      case name && verbosity > 0:
        return color(" " + name + " ", nameColor);
      case name && !verbosity > 0:
        return color(name + " > ", nameColor);
      case !name && verbosity > 0:
        return color(" ", nameColor);
      case !name && !(verbosity > 0):
        return color("> ", nameColor);
    }
    return color(
      verbosity > 0 ? name + " " || "" : name ? name + " > " : "",
      nameColor
    );
  },
  src: (key, src, {levelLabel}, { verbosity }) => {
    let { nameColor,srcColor } = getColorsByLevel(levelLabel);
    if (src) {
      return withVerbosityPrinter(
        VERBOSITY_LEVELS.VERBOSE,
        verbosity,
        color(`${src.file}:${src.line} `, srcColor) + color(" > ", nameColor)
      );
    }
  },
  message: (key, message, { levelLabel }, { verbosity }) => {
    let { messageColor } = levelColors[levelLabel] || {};
    return color(message, messageColor) + EOL;
  },
  meta: (key, meta, { levelLabel }, { verbosity }) => {
    let { metaColor } = getColorsByLevel(levelLabel);
    if (!verbosity) return "";
    let metaPrefixLength = dateLength(verbosity) + logLevelSpace;
    let line = "";
    if (meta.length) {
      line = meta
        .map(item => expandMeta(item, metaPrefixLength, metaColor, verbosity))
        .join("");
    }
    return line;
  }
};

module.exports = function writeToConsole(logMessage, logger) {
  var line = Object.keys(logLinePartsTransformers)
    .map(key => {
      return logLinePartsTransformers[key](
        key,
        logMessage[key],
        logMessage,
        logger
      );
    })
    .join("");
  process.stdout.write(line);
};
