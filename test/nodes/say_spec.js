var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var sayNode = require('./../../nodes/say.js');
var res = require('./mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('say node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(sayNode, 'say');

  it('should respond with proper XML', function(done) {
    var flow = [{ id: 'n1', type: 'say', text: 'Hello World', language: 'en-US', voice: 'alice', output: 'off' }];
    var xml = fs.readFileSync('test/resources/xml/say.xml', 'utf8');
    helper.load(sayNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
