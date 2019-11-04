module.exports = function(RED) {
  'use strict';

  function TTSNode(config) {
    RED.nodes.createNode(this, config);
    this.text = config.text;
    var node = this;
  }
  RED.nodes.registerType('tts', TTSNode);
};
