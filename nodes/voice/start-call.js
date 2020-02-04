module.exports = function(RED) {
  'use strict';
  var url = require('url');

  function StartCallNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.account = RED.nodes.getNode(config.account);
    if (!node.account) {
      this.warn('missing account configuration');
      return;
    }
    if (!config.url) {
      this.warn('missing path');
      return;
    }
    this.url = config.url;
    if (this.url[0] !== '/') {
      this.url = '/' + this.url;
    }
    this.from = config.from;
    this.to = config.to;
    var client = require('twilio')(node.account.credentials.sid, node.account.credentials.token);
    client.api.baseUrl = node.account.credentials.apiUrl;

    node.on('input', function(msg) {
      var absoluteUrl = url.resolve(this.context().global.get('baseUrl'), node.url);
      client.calls
        .create({
          url: msg.payload.url || absoluteUrl,
          to: msg.payload.to || node.to,
          from: msg.payload.from || node.from,
        })
        .then(call => {
          msg.payload = call;
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType('start-call', StartCallNode);
};
