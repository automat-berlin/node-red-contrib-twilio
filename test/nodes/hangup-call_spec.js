var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var hangupCallNode = require('../../nodes/hangup-call.js');
var accountNode = require('../../nodes/config/account.js');
var nock = require('nock');
var scope;

helper.init(require.resolve('node-red'));

describe('hangup-call node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(hangupCallNode, 'hangup-call');

  it.only('should make a proper request to Twilio', function(done) {
    var flow = [{ id: 'n1', type: 'hangup-call', account: 'n2' }, { id: 'n2', type: 'account', name: 'test' }];
    var testNodes = [accountNode, hangupCallNode];
    scope = nock('https://api.twilio.com:443')
      .post('/2010-04-01/Accounts/ACloginexamplecom/Calls/123456.json')
      .reply(200, '{}');
    var credentials = { n2: { sid: 'ACloginexamplecom', token: 'test1234' } };

    helper.load(testNodes, flow, credentials, function() {
      var n2 = helper.getNode('n2');
      var n1 = helper.getNode('n1');
      // console.log(helper._redNodes.getNodeList())
      // n2.credentials = { sid: 'ACloginexamplecom', token: 'test1234' };
      // n1.client.username = 'ACloginexamplecom'

      n1.on('input', function() {
        // try {

        // setTimeout(() => {
        // scope.done();
        // scope.done();
        // }, 100);
        // scope.done();
        // done();
        // } catch(e) {
        //   done(e)
        // }
        helper.unload();
      });
      n1.on('close', function() {
        try {
          console.log('inside close');
          scope.done();
          done();
          console.log('end of close');
        } catch (e) {
          done(e);
          console.log(e);
        }
      });
      n1.receive({ payload: { CallSid: '123456' } });
    });
  });
});
