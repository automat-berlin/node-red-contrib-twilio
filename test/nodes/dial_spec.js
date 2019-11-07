var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var dialNode = require('../../nodes/dial.js');
var playNode = require('./../../nodes/play.js');
var ttsNode = require('../../nodes/config/tts.js');
var sayNode = require('./../../nodes/say.js');
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

  it('should respond with proper XML if connected to play node', function(done) {
    var flow = [
      { id: 'n1', type: 'play', url: 'http://example.com/example.wav', output: 'next', wires: [['n2']] },
      { id: 'n2', type: 'dial', numbers: [{ number: '4915799912345' }] },
    ];
    var xml = fs.readFileSync('test/resources/xml/dial_connected_to_play.xml', 'utf8');
    helper.load([playNode, dialNode], flow, function() {
      var n1 = helper.getNode('n1');
      var n2 = helper.getNode('n2');
      n2.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML if connected to say node', function(done) {
    var flow = [
      { id: 'n1', type: 'say', tts: 'n2', output: 'next', wires: [['n3']] },
      { id: 'n2', type: 'tts', text: 'hello', voice: 'alice', language: 'en-US' },
      { id: 'n3', type: 'dial', numbers: [{ number: '4915799912345' }] },
    ];
    var xml = fs.readFileSync('test/resources/xml/dial_connected_to_say.xml', 'utf8');
    helper.load([ttsNode, sayNode, dialNode], flow, function() {
      var n1 = helper.getNode('n1');
      var n3 = helper.getNode('n3');
      n3.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for active statusCallback', function(done) {
    var flow = [{ id: 'n1', type: 'dial', numbers: [{ number: '4915799912345' }], statusCallback: true, outputs: 1 }];
    var xml = fs.readFileSync('test/resources/xml/dial_with_statusCallback.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should create status callback');
  it('should remove status callback on close');
  it('should send received status callback payload to the next node');
});
