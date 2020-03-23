# rollup-plugin-bpmnlint

[![Build Status](https://travis-ci.org/nikku/rollup-plugin-bpmnlint.svg?branch=master)](https://travis-ci.org/nikku/rollup-plugin-bpmnlint)

Convert [bpmnlint](https://github.com/bpmn-io/bpmnlint) config files to consumable modules.

```javascript
import { Linter } from 'bpmnlint';

import linterConfig from './.bpmnlintrc';

const linter = new Linter(linterConfig);
```


## Installation

```sh
npm i rollup-plugin-bpmnlint -D
```

## Usage

```js
import { rollup } from 'rollup';

import bpmnlint from 'rollup-plugin-bpmnlint';

import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

rollup({
  input: 'main.js',
  plugins: [
    nodeResolve(),
    commonjs(),
    bpmnlint({
      // matching .bpmnlintrc files per default
      include: '**/.bpmnlintrc',

      // undefined per default
      exclude: [ ]
    })
  ]
});
```

# License

MIT