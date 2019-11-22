var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var hangupCallNode = require('../../nodes/hangup-call.js');
var accountNode = require('../../nodes/config/account.js');

helper.init(require.resolve('node-red'));

describe('hangup-call node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(hangupCallNode, 'hangup-call');
});
