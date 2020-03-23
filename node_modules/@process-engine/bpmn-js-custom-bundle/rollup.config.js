import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-porter';

export default {
  input: 'index.js',
  output: {
    file: 'build/bpmn-modeler-custom.js',
    name: 'BpmnJS',
    format: 'umd',
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    json(),
    css({
      dest: 'dist/bpmn-modeler-custom.css',
      minified: false,
    })
  ],
}
