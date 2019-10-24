module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function RejectNode(config) {
    RED.nodes.createNode(this, config);
    this.reason = config.reason || 'rejected';
    var node = this;
    var response = new VoiceResponse();
    response.reject({
      reason: node.reason,
    });
    node.on('input', function(msg) {
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('reject', RejectNode);
};
