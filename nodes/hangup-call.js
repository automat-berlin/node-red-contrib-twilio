module.exports = function(RED) {
  'use strict';

  function HangupCallNode(config) {
    RED.nodes.createNode(this, config);
    this.account = RED.nodes.getNode(config.account);
    var node = this;
    if (!node.account) {
      this.warn('missing account configuration');
      return;
    }
    var client = require('twilio')(node.account.credentials.sid, node.account.credentials.token);

    node.on('input', function(msg) {
      client.calls(msg.payload.CallSid).update({ status: 'completed' });
    });
  }
  RED.nodes.registerType('hangup-call', HangupCallNode);
};
