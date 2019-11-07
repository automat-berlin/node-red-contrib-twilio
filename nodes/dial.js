module.exports = function(RED) {
  'use strict';
  var url = require('url');
  var bodyParser = require('body-parser');
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function DialNode(config) {
    RED.nodes.createNode(this, config);
    this.numbers = config.numbers;
    this.statusCallback = config.statusCallback;
    this.outputs = config.outputs;
    this.callbackUrl = '/callback-' + randomId();
    this.method = 'post';
    var node = this;

    node.on('input', function(msg) {
      var response;
      var absoluteCallbackUrl;

      if (msg.payload.twilio) {
        response = msg.payload.twilio;
      } else {
        response = new VoiceResponse();
      }
      var dial = response.dial();
      for (var number of node.numbers) {
        if (node.statusCallback) {
          absoluteCallbackUrl =
            absoluteCallbackUrl || url.resolve(node.context().global.get('baseUrl'), node.callbackUrl);
          dial.number(
            {
              statusCallbackEvent: 'initiated ringing answered completed',
              statusCallback: absoluteCallbackUrl,
            },
            number.number
          );
        } else {
          dial.number(number.number);
        }
      }
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
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
  RED.nodes.registerType('dial', DialNode);
};
