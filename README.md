# Node-RED Call Control for Twilio® TwiML® platforms

This repository contains a collection of nodes which implement a [Twilio compliant API](https://www.twilio.com/docs).

_This is a community project._

_Twilio and TwiML are registered trademarks of Twilio and/or its affiliates. Other names may be trademarks of their respective owners._

_Automat Berlin GmbH as well as the authors of this module are not affiliated with, nor endorsed by, nor connected in any way to Twilio Inc. or any of its affiliates._

## Quickstart

You can get hands-on experience with Node-RED and Twilio nodes by deploying them to [Heroku](https://www.heroku.com). You only need a free account (no credit card required).

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/automat-berlin/node-red-contrib-twilio)

Note: The 'Deploy to Heroku' button will not work properly if your browser is removing the Referer HTTP header from the request.

## Installation

Prerequisite: You need to have a running Node-RED instance. If you do not have it installed yet, read the [Node-RED Getting Started guide](https://nodered.org/docs/getting-started/).

### Install the last released version from the Node-RED dashboard

The easiest way to install Twilio nodes is to use the `Manage palette` option in the Node-RED menu (in the top right corner of its dashboard). Switch to the `Install` tab and search for `@automat-berlin/node-red-contrib-twilio`. There should be only one result. Click the `install` button next to it.

### Installation from the source code

First, clone this repository. Optionally switch to the desired branch.

Next, go to the Node-RED install directory, typically `~/.node-red`, and install the cloned package there.

```sh
cd ~/.node-red/
npm install <path-to-cloned-repository>
```

## Configuration

You should be aware of how to configure Node-RED ([read the docs here](https://nodered.org/docs/user-guide/runtime/settings-file)).

The following instructions assume that you are using the `settings.js` file for the configuration (found in the user directory or specified with `-s` command-line argument).

### Set baseUrl for StatusCallback

The base URL will be used to create an absolute `StatusCallback` URL (read more about callback requests [here](https://www.twilio.com/docs/voice/twiml#ending-the-call-callback-requests)).

Find the `functionGlobalContext` object and add the `baseUrl` property with the base URL of your Node-RED deployment.

```javascript
    ...
    functionGlobalContext: {
        baseUrl: 'http://example.com'
    },
    ...
```

## Tests

First, go to the repository's main directory and install all dependencies:

```sh
npm install
```

Then to run all tests use this command:

```sh
npm test
```

## Contributing

We welcome all contributions. Please read our [contributing guidelines](CONTRIBUTING.md).

Contact us if you have any questions via email at info@automat.berlin or create an issue.

## Contact

This repository is owned and maintained by [Automat Berlin GmbH](https://automat.berlin/).

Twilio® and TwiML® are registered trademarks of Twilio and/or its affiliates.

## License

The code in this repository is released under the MIT license. See [LICENSE](LICENSE) for details.
