var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var messageNode = require('../../../nodes/sms/message.js');
var res = require('../mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('message node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(messageNode, 'message');

  it('should respond with proper XML', function(done) {
    var flow = [{ id: 'n1', type: 'message', text: 'Hello World!' }];
    var xml = fs.readFileSync('test/resources/xml/message.xml', 'utf8');
    helper.load(messageNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<message data>', res: res });
    });
  });
});
