module.exports = function(RED) {
  'use strict';
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function GatherNode(config) {
    RED.nodes.createNode(this, config);
    this.numDigits = config.numDigits;
    this.timeout = config.timeout || 5;
    this.sound = config.sound;
    this.soundUrl = config.soundUrl;
    this.tts = RED.nodes.getNode(config.tts);
    var node = this;

    node.on('input', function(msg) {
      var response = new VoiceResponse();
      var gatherAttributes = { timeout: node.timeout };
      if (node.numDigits) {
        gatherAttributes.numDigits = node.numDigits;
      }
      var gather = response.gather(gatherAttributes);
      if (node.sound && node.sound == 'url' && node.soundUrl) {
        gather.play(node.soundUrl);
      } else if (node.sound && node.sound == 'tts' && node.tts.text) {
        gather.say(
          {
            voice: node.tts.voice,
            language: node.tts.language,
          },
          node.tts.text
        );
      }
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('gather', GatherNode);
};
