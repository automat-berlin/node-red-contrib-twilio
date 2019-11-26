var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var redirectNode = require('../../../nodes/sms/redirect.js');
var res = require('../mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('redirect node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(redirectNode, 'redirect');

  it('should create redirect endpoint');
  it('should remove redirect endpoint on close');
  it('should send received redirect endpoint payload to the next node');
});
