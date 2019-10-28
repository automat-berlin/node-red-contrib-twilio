module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function HangupNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function(msg) {
      var response;
      if (msg.payload.twilio) {
        response = msg.payload.twilio;
      } else {
        response = new VoiceResponse();
      }
      response.hangup();
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('hangup', HangupNode);
};
