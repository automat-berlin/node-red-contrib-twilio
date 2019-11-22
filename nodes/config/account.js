module.exports = function(RED) {
  function AccountNode(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType('account', AccountNode, {
    credentials: {
      sid: { type: 'text' },
      token: { type: 'password' },
      endpoint: { type: 'text' },
    },
  });
};
