module.exports = function(RED) {
  'use strict';
  var renderTemplate = require('../../utils/renderTemplate.js');

  function SendSmsNode(config) {
    RED.nodes.createNode(this, config);
    this.account = RED.nodes.getNode(config.account);
    this.text = config.text;
    this.from = config.from;
    this.fromType = config.fromType;
    this.to = config.to;
    this.toType = config.toType;
    var node = this;

    if (!node.account) {
      this.warn('missing account configuration');
      return;
    }

    var client = require('twilio')(node.account.credentials.sid, node.account.credentials.token);
    client.api.baseUrl = node.account.credentials.apiUrl;

    node.on('input', function(msg) {
      var fromNumber;
      var toNumber;
      if (node.fromType === 'msg') {
        fromNumber = RED.util.getMessageProperty(msg, node.from);
      } else {
        fromNumber = node.from;
      }
      if (node.toType === 'msg') {
        toNumber = RED.util.getMessageProperty(msg, node.to);
      } else {
        toNumber = node.to;
      }
      client.messages
        .create({
          body: renderTemplate(msg, node.text),
          from: fromNumber,
          to: toNumber,
        })
        .then(message => {
          msg.payload = message;
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType('send-sms', SendSmsNode);
};
