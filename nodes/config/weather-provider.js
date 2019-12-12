module.exports = function(RED) {
  'use strict';

  function WeatherProviderNode(config) {
    RED.nodes.createNode(this, config);
    this.provider = config.provider;
  }
  RED.nodes.registerType('weather-provider', WeatherProviderNode, {
    credentials: {
      apiKey: { type: 'password' },
    },
  });
};
