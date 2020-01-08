A logger Util that:
- Is colorful
- Can trace where in the code log was writen
- Extendable transport
- Extendable levels dictionary


## Getting Started
```js
npm install -s chillogger
const Logger = require("chillogger");
const log = Logger("Main",optionalCustomLevels) //A name for logger intanse; name can be left empty, or be true, which will give your logger a random name

log("info", "sdfsdfsdf");
log.error(new Error("sdfsdf"));
log.info()
```

### Advance
process enviroment:
```js
process.env.trace = 0/1 // show/hide what line called logger, enable stacktrace, enable timers
process.env.level = 3 // set max level
```

levels
```js
const customLevel = {
    fatal: {
        level: 0,
        messageColor: "RED",
        labelColor: "WHITE_ON_RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "YELLOW"
    }
}
