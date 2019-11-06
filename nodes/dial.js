module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function DialNode(config) {
    RED.nodes.createNode(this, config);
    this.numbers = config.numbers;
    var node = this;

    node.on('input', function(msg) {
      var response = new VoiceResponse();
      var dial = response.dial();
      for (var number of node.numbers) {
        dial.number(number.number);
      }
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('dial', DialNode);
};
