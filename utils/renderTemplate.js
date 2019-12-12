module.exports = function(msg, template) {
  var renderedTemplate = template;
  var tokens = template.match(/{{[^{]+}}/g) || [];
  tokens.forEach(function(token) {
    var expression = token.substring(2, token.length - 2);
    var parts = expression.split('.');
    var value = msg;
    parts.forEach(function(part) {
      var match = part.match(/^(.+)\[(.+)\]$/);
      if (match) {
        var name = match[1];
        var index = match[2];
        value = value[name][index];
      } else {
        var name = part;
        value = value[name];
      }
    });
    if (value === undefined) {
      value = '';
    }
    renderedTemplate = renderedTemplate.replace(token, value);
  });
  return renderedTemplate;
};
