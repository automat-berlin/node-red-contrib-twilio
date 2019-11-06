var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var dialNode = require('../../nodes/dial.js');
var res = require('./mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('dial node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(dialNode, 'dial');

  it('should respond with proper XML for one number', function(done) {
    var flow = [{ id: 'n1', type: 'dial', numbers: [{ number: '4915799912345' }] }];
    var xml = fs.readFileSync('test/resources/xml/dial_one_number.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for two numbers', function(done) {
    var flow = [{ id: 'n1', type: 'dial', numbers: [{ number: '4915799912345' }, { number: '492111234567' }] }];
    var xml = fs.readFileSync('test/resources/xml/dial_two_numbers.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
