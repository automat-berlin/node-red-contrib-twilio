module.exports = function(RED) {
  'use strict';
  var bodyParser = require('body-parser');
  var VoiceResponse = require('twilio').twiml.VoiceResponse;
  var renderTemplate = require('../../utils/renderTemplate.js');

  function GatherNode(config) {
    RED.nodes.createNode(this, config);
    this.numDigits = config.numDigits;
    this.timeout = config.timeout || 5;
    this.sound = config.sound;
    this.soundUrl = config.soundUrl;
    this.tts = RED.nodes.getNode(config.tts);
    this.actionUrl = '/action-' + randomId();
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

    RED.httpNode.post(this.actionUrl, urlencParser, this.callback, this.errorHandler);

    this.on('close', function() {
      var node = this;
      RED.httpNode._router.stack.forEach(function(route, i, routes) {
        if (route.route && route.route.path === node.actionUrl && route.route.methods[node.method]) {
          routes.splice(i, 1);
        }
      });
    });

    node.on('input', function(msg) {
      var response;
      if (msg.payload.twilio) {
        response = msg.payload.twilio;
      } else {
        response = new VoiceResponse();
      }
      var gatherAttributes = {
        action: node.actionUrl,
        timeout: node.timeout,
      };
      if (node.numDigits) {
        gatherAttributes.numDigits = node.numDigits;
      }
      var gather = response.gather(gatherAttributes);
      if (node.sound && node.sound == 'url' && node.soundUrl) {
        gather.play(node.soundUrl);
      } else if (node.sound && node.sound == 'tts' && node.tts.text) {
        gather.say(
          {
            voice: node.tts.voice,
            language: node.tts.language,
          },
          renderTemplate(msg, node.tts.text)
        );
      }
      msg.payload = response.toString();
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('gather', GatherNode);
};
