var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('./shared.js');
var ttsNode = require('../../nodes/config/tts.js');
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
        should(msg.res._res.responseBody).be.eql(xml.replace('${actionUrl}', n1.actionUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom numDigits value', function(done) {
    var flow = [{ id: 'n1', type: 'gather', numDigits: 1 }];
    var xml = fs.readFileSync('test/resources/xml/gather_numDigits.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${actionUrl}', n1.actionUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom timeout value', function(done) {
    var flow = [{ id: 'n1', type: 'gather', timeout: 10 }];
    var xml = fs.readFileSync('test/resources/xml/gather_timeout.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${actionUrl}', n1.actionUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for Sound URL', function(done) {
    var flow = [{ id: 'n1', type: 'gather', sound: 'url', soundUrl: 'http://example.com/example.wav' }];
    var xml = fs.readFileSync('test/resources/xml/gather_soundUrl.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${actionUrl}', n1.actionUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for Text-to-Speech', function(done) {
    var flow = [
      { id: 'n1', type: 'gather', sound: 'tts', tts: 'n2' },
      { id: 'n2', type: 'tts', text: 'hello', voice: 'alice', language: 'en-US' },
    ];
    var testNodes = [ttsNode, gatherNode];
    var xml = fs.readFileSync('test/resources/xml/gather_tts.xml', 'utf8');
    helper.load(testNodes, flow, function() {
      var n1 = helper.getNode('n1');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${actionUrl}', n1.actionUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should create action callback');
  it('should remove action callback on close');
  it('should send received action callback payload to the next node');
});
