module.exports = function(RED) {
  'use strict';
  var MessagingResponse = require('twilio').twiml.MessagingResponse;

  function MessageNode(config) {
    RED.nodes.createNode(this, config);
    this.text = config.text;
    var node = this;

    node.on('input', function(msg) {
      var response = new MessagingResponse();
      var message = response.message();
      message.body(node.text);
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('message', MessageNode);
};
