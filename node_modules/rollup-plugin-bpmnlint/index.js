const compileConfig = require('bpmnlint/lib/support/compile-config');

const { createFilter } = require('rollup-pluginutils');


function bpmnlint(options = {}) {

  let {
    include,
    exclude
  } = options;

  if (typeof include === 'undefined') {
    include = /\/.bpmnlintrc$/;
  }

  const filter = createFilter(include, exclude);

  return {
    name: 'bpmnlint',

    async transform(code, id) {

      if (!filter(id)) {
        return;
      }

      let config, transformedCode;

      try {
        config = JSON.parse(code);
      } catch (err) {

        const match = /^(Unexpected token \n) in JSON at position (23)$/.exec(err.message);

        const message = match && match[1] || err.message;
        const position = match && parseInt(match[2], 10);

        return this.error('Failed to parse config: ' + message, position);
      }

      try {
        transformedCode = await compileConfig(config);
      } catch (err) {
        return this.error('Failed to compile config: ' + err.message);
      }

      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

module.exports = bpmnlint;