var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var ttsNode = require('../../../nodes/config/tts.js');

helper.init(require.resolve('node-red'));

describe('tts config node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(ttsNode, 'tts');
});
