module.exports = function(RED) {
  'use strict';
  var url = require('url');
  var bodyParser = require('body-parser');
  var VoiceResponse = require('twilio').twiml.VoiceResponse;

  function SayNode(config) {
    RED.nodes.createNode(this, config);
    this.tts = RED.nodes.getNode(config.tts);
    this.output = config.output;
    this.outputs = config.outputs;
    this.redirectUrl = '/redirect-' + randomId();
    this.method = 'post';
    var node = this;

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

    if (node.output == 'redirect') {
      RED.httpNode.post(this.redirectUrl, urlencParser, this.callback, this.errorHandler);

      this.on('close', function() {
        var node = this;
        RED.httpNode._router.stack.forEach(function(route, i, routes) {
          if (route.route && route.route.path === node.redirectUrl && route.route.methods[node.method]) {
            routes.splice(i, 1);
          }
        });
      });
    }

    node.on('input', function(msg) {
      var response = new VoiceResponse();
      response.say(
        {
          voice: node.tts.voice,
          language: node.tts.language,
        },
        node.tts.text
      );
      if (node.output == 'next') {
        msg.payload = {
          twilio: response,
        };
        node.send(msg);
      } else if (node.output == 'off') {
        msg.payload = response.toString();
        msg.res._res.set('Content-Type', 'application/xml');
        msg.res._res.status(200).send(msg.payload);
      } else if (node.output == 'redirect') {
        var absoluteRedirectUrl = url.resolve(this.context().global.get('baseUrl'), node.redirectUrl);
        response.redirect(absoluteRedirectUrl);
        msg.payload = response.toString();
        msg.res._res.set('Content-Type', 'application/xml');
        msg.res._res.status(200).send(msg.payload);
      }
    });
  }
  RED.nodes.registerType('say', SayNode);
};
