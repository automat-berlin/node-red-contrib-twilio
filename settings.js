var baseUrl, uiPort;

uiPort = process.env.PORT || 1880;

if (process.env.APP_NAME) {
  baseUrl = 'https://' + process.env.APP_NAME + '.herokuapp.com';
} else {
  baseUrl = 'http://localhost:' + uiPort;
}

module.exports = {
  // the tcp port that the Node-RED web server is listening on
  uiPort: uiPort,

  // The file containing the flows. If not set, it defaults to flows_<hostname>.json
  flowFile: 'examples/All flows.json',

  // Node-RED scans the `nodes` directory in the userDir to find local node files
  userDir: __dirname,

  // defines order of the categories in the editor palette
  paletteCategories: [
    'subflows',
    'twilio',
    'twilio voice',
    'twilio sms',
    'weather',
    'input',
    'output',
    'function',
    'storage',
    'advanced',
  ],

  // sets global context data
  functionGlobalContext: {
    // required to generate sipgate callbacks URLs
    baseUrl: baseUrl,
  },
};
