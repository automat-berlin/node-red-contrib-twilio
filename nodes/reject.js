module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function RejectNode(config) {
    RED.nodes.createNode(this, config);
    this.reason = config.reason || 'rejected';
    var node = this;
    node.on('input', function(msg) {
      var response;
      if (msg.payload.twilio) {
        response = msg.payload.twilio;
      } else {
        response = new VoiceResponse();
      }
      response.reject({
        reason: node.reason,
      });
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('reject', RejectNode);
};
