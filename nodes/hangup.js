module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function HangupNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var response = new VoiceResponse();
    response.hangup();
    node.on('input', function(msg) {
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('hangup', HangupNode);
};
