const nodeConsole = require("./transports/node-console");
const NS_PER_SEC = 1e9;
const crypto = require("crypto");
const hrtime = require("browser-process-hrtime");

const LogId = () => {
  let logId = (
    Number(Date.now()).toString(16) + crypto.prng(7).toString("hex")
  ).toUpperCase();
  return logId.slice(1);
};

var parseStack = function parseStack(stack, skip = 0) {
  var expression = /at .*(?:[\/\\](?:([a-z0-9\-._]*)\:([0-9]*)\:))/g;
  for (var i = 0; i < skip; i++) {
    expression.exec(stack);
  }
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
};

const baseLevels = {
  fatal: 0,
  alert: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  todo: 4,
  deprecated: 4,
  time: 5,
  trace: 5
};

const $chilloger = {
  level: process.env.level ? parseInt(process.env.level) : 3,
  trace: process.env.trace ? true : false,
  verbosity: process.env.verbosity ? parseInt(process.env.verbosity) : 0
};

module.exports = class Logger {
  constructor(name, options = {}) {
    const {
      transport = [nodeConsole],
      levels = {},
      level = $chilloger.level,
      trace = $chilloger.trace,
      verbosity = $chilloger.verbosity
    } = options;
    switch (true) {
      case typeof name === "string":
        this.name = name;
        break;
      case typeof name === "boolean":
        this.name = LogId();
        break;
      default:
        break;
    }
    Object.assign(this, {
      level,
      trace,
      verbosity,
      transport,
      levels: Object.assign({}, baseLevels, levels)
    });

    Object.keys(this.levels).forEach(level => {
      if (typeof(this[level])!=="undefined") return;

      Object.defineProperty(this, level, {
        value: this.log.bind(this, level)
      });
    });

    this.timetrackers = {};
  }

  static setGlobalLevel(level) {
    $chilloger.level = level;
  }
  static setGlobalTrace(trace) {
    $chilloger.trace = trace;
  }
  static setGlobalVerbosity(verbosity) {
    $chilloger.verbosity = verbosity;
  }

  setLevel(level) {
    this.level = level;
  }
  setTrace(trace) {
    this.trace = trace;
  }
  setVerbosity(verbosity) {
    this.verbosity = verbosity;
  }

  $$tranform(levelLabel, tracker, message, ...meta) {
    levelLabel = this.levels[levelLabel] ? levelLabel : "debug";
    let level = this.levels[levelLabel];

    return {
      name: this.name,
      message,
      meta,
      level,
      levelLabel,
      ts: Date.now(),
      src: this.trace ? parseStack(tracker.stack, 1) : undefined
    };
  }

  $$dispatch(message) {
    if (message.level > this.level) return;
    this.transport.forEach(transport=>transport(message, this));
    return this;
  }

  error(error) {
    if (error) {
      if (!error.message) return this.log("error", JSON.stringify(error));
      const tracker = {};
      Error.captureStackTrace(tracker, 1);
      let meta = [];
      if (this.trace) {
        meta.push(`An ${error.name} occurred; here is the stack trace:`);
        meta = meta.concat(error.stack.split("\n"));
        meta.push;
      }

      this.$$dispatch(this.$$tranform("error", tracker, error.message, ...meta));
    }
  }
  log(level, message, ...meta) {
    const tracker = {};
    Error.captureStackTrace(tracker, 1);
    this.$$dispatch(this.$$tranform(level, tracker, message, ...meta));
  }

  time(label) {
    if (!this.trace) return;
    var tracker = {};
    Error.captureStackTrace(tracker);
    this.timetrackers[label] = {
      ...parseStack(tracker.stack, 1),
      ts: hrtime()
    };
  }
  timeEnd(label) {
    if (!this.trace) return;
    let { file, line, ts } = this.timetrackers[label];
    let diff = Math.round((ts[0] * NS_PER_SEC + ts[1]) / 1000) / 1000;
    this.log("time", `${label}: ${diff}`, `Origin: ${file}:${line}`);
  }
};
