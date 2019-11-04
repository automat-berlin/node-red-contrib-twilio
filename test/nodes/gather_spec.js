var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var gatherNode = require('../../nodes/gather.js');
var res = require('./mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('gather node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(gatherNode, 'gather');

  it('should respond with proper XML', function(done) {
    var flow = [{ id: 'n1', type: 'gather' }];
    var xml = fs.readFileSync('test/resources/xml/gather.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
