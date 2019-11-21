module.exports = function(RED) {
  'use strict';
  var MessagingResponse = require('twilio').twiml.MessagingResponse;

  function MessageNode(config) {
    RED.nodes.createNode(this, config);
    this.text = config.text;
    this.from = config.from;
    this.to = config.to;
    this.next = config.next;
    this.outputs = config.outputs;
    var node = this;

    node.on('input', function(msg) {
      var response;
      if (msg.payload.twilio) {
        response = msg.payload.twilio;
      } else {
        response = new MessagingResponse();
      }
      var messageAttributes = {};
      if (node.from) {
        messageAttributes.from = node.from;
      }
      if (node.to) {
        messageAttributes.to = node.to;
      }
      var message = response.message(messageAttributes);
      message.body(node.text);
      if (node.next) {
        msg.payload = {
          twilio: response,
        };
        node.send(msg);
      } else {
        msg.payload = response.toString();
        msg.res._res.set('Content-Type', 'application/xml');
        msg.res._res.status(200).send(msg.payload);
      }
    });
  }
  RED.nodes.registerType('message', MessageNode);
};
