module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function PlayNode(config) {
    RED.nodes.createNode(this, config);
    this.url = config.url;
    this.output = config.output;
    this.outputs = config.outputs;
    var node = this;
    node.on('input', function(msg) {
      var response = new VoiceResponse();
      response.play(node.url);
      if (node.output == 'next') {
        msg.payload = {
          twilio: response,
        };
        node.send(msg);
      } else if (node.output == 'off') {
        msg.payload = response.toString();
        msg.res._res.set('Content-Type', 'application/xml');
        msg.res._res.status(200).send(msg.payload);
      }
    });
  }
  RED.nodes.registerType('play', PlayNode);
};
