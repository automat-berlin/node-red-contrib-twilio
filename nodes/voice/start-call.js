module.exports = function(RED) {
  'use strict';
  var url = require('url');
  var bodyParser = require('body-parser');

  function StartCallNode(config) {
    RED.nodes.createNode(this, config);
    this.account = RED.nodes.getNode(config.account);
    this.from = config.from;
    this.fromType = config.fromType;
    this.to = config.to;
    this.toType = config.toType;
    this.webhookUrl = '/webhook-' + randomId();
    this.method = 'post';
    var node = this;

    if (!node.account) {
      this.warn('missing account configuration');
      return;
    }

    function randomId() {
      return Math.floor(Math.random() * 1000000);
    }

    this.errorHandler = function(err, req, res) {
      node.warn(err);
      res.sendStatus(500);
    };

    this.callback = function(req, res) {
      var msgid = RED.util.generateId();
      res._msgid = msgid;
      var msg = { _msgid: msgid, req: req, res: { _res: res }, payload: req.body };
      node.send(msg);
    };

    var maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
    var urlencParser = bodyParser.urlencoded({ limit: maxApiRequestSize, extended: true });

    RED.httpNode.post(this.webhookUrl, urlencParser, this.callback, this.errorHandler);

    this.on('close', function() {
      var node = this;
      RED.httpNode._router.stack.forEach(function(route, i, routes) {
        if (route.route && route.route.path === node.webhookUrl && route.route.methods[node.method]) {
          routes.splice(i, 1);
        }
      });
    });

    var client = require('twilio')(node.account.credentials.sid, node.account.credentials.token);
    client.api.baseUrl = node.account.credentials.apiUrl;

    node.on('input', function(msg) {
      var absoluteWebhookUrl = url.resolve(this.context().global.get('baseUrl'), node.webhookUrl);
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
      client.calls
        .create({
          url: absoluteWebhookUrl,
          to: toNumber,
          from: fromNumber,
        })
        .then(call => {
          node.log(call);
        });
    });
  }
  RED.nodes.registerType('start-call', StartCallNode);
};
