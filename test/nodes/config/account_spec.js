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

  it('should allow to read credentials', function(done) {
    var flow = [{ id: 'n1', type: 'account', name: 'test' }];
    var credentials = { credentials: { sid: 'ACloginexamplecom', token: 'test1234' } };

    helper.load(accountNode, flow, credentials, function() {
      var n1 = helper.getNode('n1');
      console.log(helper._redNodes.getFlows().flows[0].getNodeCredentials);
      done();
    });
  });
});
