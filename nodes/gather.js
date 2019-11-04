module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function GatherNode(config) {
    RED.nodes.createNode(this, config);
    this.sound = config.sound;
    this.soundUrl = config.soundUrl;
    var node = this;
    node.on('input', function(msg) {
      var response = new VoiceResponse();
      var gather = response.gather();
      if (node.sound && node.sound == 'url' && node.soundUrl) {
        gather.play(node.soundUrl);
      }
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('gather', GatherNode);
};
