A logger Util that:
- Is colorful
- Can trace where in the code log was writen
- can attach Metadata to logger
- Extendable transport
- Extendable levels dictionary


## Getting Started
```js
npm install -s chillogger
const Logger = require("chillogger");
const log = Logger("Main") //A name for logger intanse; name can be left empty, or be true, which will give your logger a random name

log("info", "sdfsdfsdf");
log(new Error("sdfsdf"));
```

### Advance
process enviroment

process.env.trace = 1
process.env.level = 6;


const levels = {
    fatal: {
        level: 0,
        messageColor: "RED",
        labelColor: "WHITE_ON_RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "YELLOW"
    },
    error: {
        level: 1,
        messageColor: "WHITE",
        labelColor: "RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "RED"
    },
    sec_high:{
        level: 0,
        messageColor: "RED",
        labelColor: "WHITE_ON_RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "YELLOW"
    },
    sec_mid:{
        level: 2,
        messageColor: "WHITE",
        labelColor: "YELLOW",
        metaColor: "GRAY",
        srcColor: "YELLOW_ON_YELLOW",
    },
    sec_low:{
        level: 3,
        messageColor: "WHITE",
        labelColor: "GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    sec_trace:{
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },

    warning: {
        level: 2,
        messageColor: "WHITE",
        labelColor: "YELLOW",
        metaColor: "GRAY",
        srcColor: "YELLOW_ON_YELLOW",
    },
    info: {
        level: 3,
        messageColor: "WHITE",
        labelColor: "GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    time:{
        level: 3,
        messageColor: "PURPLE",
        labelColor: "WHITE_ON_PURPLE",
        srcColor: "WHITE_ON_PURPLE",
        metaColor: "GRAY"
    },
    debug:{
        level: 4,
        messageColor: "WHITE",
        labelColor: "PURPLE",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    trace: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    deprecated: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "YELLOW_ON_YELLOW",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    }
}

const Logger = require("../logger");




Y

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
