module.exports = function(RED) {
  'use strict';
  var bodyParser = require('body-parser');
  var MessagingResponse = require('twilio').twiml.MessagingResponse;

  function MessageNode(config) {
    RED.nodes.createNode(this, config);
    this.text = config.text;
    this.from = config.from;
    this.to = config.to;
    this.next = config.next;
    this.statusCallback = config.statusCallback;
    this.outputs = config.outputs;
    this.callbackUrl = '/callback-' + randomId();
    this.method = 'post';
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
      if (node.statusCallback) {
        messageAttributes.action = node.callbackUrl;
        messageAttributes.method = node.method;
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
      res.sendStatus(200);
      node.send(msg);
    };

    var maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
    var urlencParser = bodyParser.urlencoded({ limit: maxApiRequestSize, extended: true });

    if (node.statusCallback) {
      RED.httpNode.post(this.callbackUrl, urlencParser, this.callback, this.errorHandler);

      this.on('close', function() {
        var node = this;
        RED.httpNode._router.stack.forEach(function(route, i, routes) {
          if (route.route && route.route.path === node.callbackUrl && route.route.methods[node.method]) {
            routes.splice(i, 1);
          }
        });
      });
    }
  }
  RED.nodes.registerType('message', MessageNode);
};
