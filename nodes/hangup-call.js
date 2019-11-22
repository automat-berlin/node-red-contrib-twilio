module.exports = function(RED) {
  'use strict';

  function HangupCallNode(config) {
    RED.nodes.createNode(this, config);
    // try {
    this.account = RED.nodes.getNode(config.account);
    var node = this;
    if (!node.account) {
      this.warn('missing account configuration');
      return;
    }
    console.log(node.account);
    var client = require('twilio')(node.account.credentials.sid, node.account.credentials.token);

    node.on('input', function(msg, send, done) {
      // console.log(node.account.credentials);
      var result = client
        .calls(msg.payload.CallSid)
        .update({ status: 'completed' })
        .then(call => {
          console.log('before done in then');
          done();
          console.log('after done in then');
        })
        .catch(e => {
          console.log('before done in catch');
          console.log(e);
          console.log('after done in catch');
          done();
        });
      // console.log(result);
      // done();
    });
    // } catch(e) {
    //   console.log(e);
    // }
  }
  RED.nodes.registerType('hangup-call', HangupCallNode);
};
