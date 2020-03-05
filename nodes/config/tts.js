module.exports = function(RED) {
  'use strict';

  function TTSNode(config) {
    RED.nodes.createNode(this, config);
    this.text = config.text;
    this.language = config.language;
    this.voice = config.voice;
  }
  RED.nodes.registerType('tts', TTSNode);
};
