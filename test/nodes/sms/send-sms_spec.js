var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var sendSmsNode = require('../../../nodes/sms/send-sms.js');
var accountNode = require('../../../nodes/config/account.js');
var nock = require('nock');

helper.init(require.resolve('node-red'));

describe('send-sms node', function() {
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

  shared.shouldLoadCorrectly(sendSmsNode, 'send-sms');

  it('should make a proper request to Messages API', function(done) {
    var flow = [
      {
        id: 'n1',
        type: 'send-sms',
        account: 'n2',
        fromType: 'msg',
        from: 'env.fromNumber',
        toType: 'msg',
        to: 'req.params.number',
        text: 'Your authentication token: {{req.params.token}}',
      },
      { id: 'n2', type: 'account', name: 'test' },
    ];
    var testNodes = [sendSmsNode, accountNode];
    var credentials = {
      n2: {
        sid: 'ACdcb897af9ca9de8e8bd213bdcafd837d',
        token: 'bdadafd6673cb8374bcdedbd83620384bd',
        apiUrl: 'https://api.twilio.connectors.automat.berlin',
      },
    };
    var scope = nock('https://api.twilio.connectors.automat.berlin')
      .post(
        '/2010-04-01/Accounts/ACdcb897af9ca9de8e8bd213bdcafd837d/Messages.json',
        'To=49987654321&From=49123456789&Body=Your%20authentication%20token%3A%20123456'
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
      n1.receive({ env: { fromNumber: '49123456789' }, req: { params: { number: '49987654321', token: '123456' } } });
    });
  });
});
