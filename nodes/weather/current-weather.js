module.exports = function(RED) {
  'use strict';
  var request = require('request');

  function CurrentWeatherNode(config) {
    RED.nodes.createNode(this, config);
    this.weatherProvider = RED.nodes.getNode(config.weatherProvider);
    this.property = config.property || 'payload.postalCode';
    var node = this;

    if (!node.weatherProvider) {
      this.warn('missing weather provider configuration');
      return;
    }

    node.on('input', function(msg) {
      var postalCode = RED.util.getMessageProperty(msg, node.property);

      if (postalCode === undefined) {
        node.warn('undefined postalCode');
        return;
      }

      var opts = {};
      opts.url =
        'https://api.openweathermap.org/data/2.5/weather?units=metric&APPID=' +
        node.weatherProvider.credentials.apiKey +
        '&zip=' +
        postalCode +
        ',de';
      opts.method = 'GET';
      opts.headers = {};
      opts.headers['Content-Type'] = 'application/json';
      request(opts, function(error, response) {
        if (response && response.statusCode == 200) {
          msg.payload = JSON.parse(response.body);

          var temp = msg.payload.main.temp;
          var cityName = msg.payload.name;
          msg.payload.temp = Math.round(temp);
          msg.payload.cityName = cityName;

          node.send(msg);
        } else {
          node.warn(response);
        }
      });
    });
  }
  RED.nodes.registerType('current-weather', CurrentWeatherNode);
};
