var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var hangupCallNode = require('../../../nodes/voice/hangup-call.js');
var accountNode = require('../../../nodes/config/account.js');
var nock = require('nock');

helper.init(require.resolve('node-red'));

describe('hangup-call node', function() {
  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(hangupCallNode, 'hangup-call');

  it('should make a proper request to defined API URL', function(done) {
    var flow = [
      { id: 'n1', type: 'hangup-call', account: 'n2' },
      { id: 'n2', type: 'account', name: 'test' },
    ];
    var testNodes = [hangupCallNode, accountNode];
    var credentials = {
      n2: {
        sid: 'ACdcb897af9ca9de8e8bd213bdcafd837d',
        token: 'bdadafd6673cb8374bcdedbd83620384bd',
        apiUrl: 'https://api.twilio.connectors.automat.berlin',
      },
    };
    var scope = nock('https://api.twilio.connectors.automat.berlin')
      .post(
        '/2010-04-01/Accounts/ACdcb897af9ca9de8e8bd213bdcafd837d/Calls/CA73bf7dfbcd7a7d8292bda7210dbda831.json',
        /completed/
      )
      .reply(200, {});

    helper.load(testNodes, flow, credentials, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function() {
        var isDone = setInterval(function() {
          if (scope.isDone()) {
            clearInterval(isDone);
            done();
          }
        }, 1);
        setTimeout(function() {
          clearInterval(isDone);
          scope.done();
        }, 1000);
      });
      n1.receive({ payload: { CallSid: 'CA73bf7dfbcd7a7d8292bda7210dbda831' } });
    });
  });
});
