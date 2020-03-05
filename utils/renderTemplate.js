/**
 * renderTemplate module.
 * @module utils/renderTemplate
 */

/**
 * Populate the template with values from the msg object.
 *
 * @param {Object} msg - The object with values which should be used in the template.
 * @param {string} template - The template string which will be populated with values from the msg object.
 *
 * @example
 * var msg = {
 *   date: "Monday",
 *   payload: {
 *     name: "Fred"
 *   }
 * }
 * var template = "Hello {{payload.name}}. Today is {{date}}"
 *
 * renderTemplate(msg, template) // returns: Hello Fred. Today is Monday
 *
 * @returns {string} The rendered template as a string.
 */

module.exports = function(msg, template) {
  var renderedTemplate = template;
  var tokens = template.match(/{{[^{]+}}/g) || [];
  tokens.forEach(function(token) {
    var expression = token.substring(2, token.length - 2);
    var parts = expression.split('.');
    var value = msg;
    parts.forEach(function(part) {
      var match = part.match(/^(.+)\[(.+)\]$/);
      var name;
      if (match) {
        name = match[1];
        var index = match[2];
        value = value[name][index];
      } else {
        name = part;
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
