var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var accountNode = require('../../../nodes/config/account.js');

helper.init(require.resolve('node-red'));

describe('account config node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(accountNode, 'account');
});
