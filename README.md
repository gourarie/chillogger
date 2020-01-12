## chillogger

A logger Util that:
- Is colorful
- Can trace where in the code log was written
- Extendable transport
- Extendable levels dictionary

### Getting Started
```cmd
npm install -s chillogger
```

```js
//import chillogger
const Chillogger = require("chillogger");
//create an instance
const logger = new Chillogger()

//Usage option 1: using logger.log:
// logger.log("level", message, ...metaObjects)
logger.log("info", "info",{"key":value},"string", function;

//Usage option 2: using logger.[level name]:
// logger.info(message, ...metaObjects)
log.info("info");

//Usage option 3, only for Error: using logger.error(error):
// will log error only if it is an object that has "message" on its.
log.error(new Error("this is an error"));
```

### API
chilloger is configurable on 2 levels:
- instance: Set the config on the chilloger instance
- global: Set the defaults for any instance constructed from now on

Instance is created with:
### `new Logger([name][,options])`

* `name` {string|Boolen} add logger name; in the build in node-console transport this will be included in any line logged using the instance
  if `true` is passed, chillogger will generate an id for you
* `options` {Object}
  * `transport`: {function[]} an array of functions that handles new log message, called by the instance with `f(logMessage, loggerInstance)` **Default:** `built in node-console transport`
  * `levels`: {Object} An object mapping log labels (for example "trace") to level (4) **Default:** see `baseLevels`.
  * `level`: {number} Max level to log **Default:** `3` 
  * `trace`: {boolean} Enables time, and timeEnd, and chillogger's ability to trace log to file/line **Default:** `false`.
  * `verbosity`: {number} built in console trasnport verbosity use `0`, `1`, or `1` **Default:** `0` 
* Returns: loggerInstance
  
Some of these options are also configurable globally:
```js
// set default trace
process.env.trace = 0
// or
Logger.setGlobalTrace(0)

// set default level
process.env.level = 4
  // or
Logger.setGlobalLevel(4)

// set defaul verbosity
process.env.verbosity = 2
  //or
Logger.setGlobalVerbosity(2)
```

### `chillogger instance`
* `public methods` 
  * `setLevel(level)`
  * `setTrace(trace)`
  * `setVerbosity(verbosity)`
  * `log(level, messageString, ...meta)`
  * `error(error)`
  * `time(label)`: time tracker that tells you where (file and line) timer started
  * `timeEnd(label)`

Also, all names of levels passed to the instance constructor as options, plus the build in levels are exposed using
```js
log.bind(logger, levelName);
```
so if you have a level named "tellMommy" you can go 
```js
logger.tellMommy("everything",{mother: {knows: CONSTS.BEST}})`
```
Keep in mind that if your level name is reserved for chilloggers methods, it will not replace it. 

### `baseLevels`
The default levels map
```js
 {
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
  }
```

### `log message object`
```js
    {
      name, // logger instance name
      message, //string message
      meta, //an array of metadata objects;
      level, //log level
      levelLabel, //log level label
      ts: Date.now(), 
      src: { //src will be included only in case the instance is running with trace===true
        file, //file name
        line //line in code that called chillogger
      }
    }
  }
```