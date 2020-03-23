# bpmn.io custom bundle

This project creates a bundle of the bpmn.io components, at the end of
the bundling process there is one javascript file and one css file ready to use.

## What are the goals of this project?

**Motivation**: We created this project to solve a bundling issue, when using
aurelia and bpnm.io there are some dependencies that cannot be resolved. For
example some parts of bpnm.io require the NodeJS `fs` module.

To get around this issue we tried using the [`bower-bpmn-js`](https://github.com/bpmn-io/bower-bpmn-js)
module via bower in our aurelia application. This worked but we also needed
the [`bpmn-js-properties-panel`](https://github.com/bpmn-io/bpmn-js-properties-panel)
module, but there was no bower version for that (See [bpmn-io/bpmn-js-properties-panel#197](https://github.com/bpmn-io/bpmn-js-properties-panel/issues/197)).

This projects aims to solve the problem by bundling `bower-bpmn-js` and
`bpmn-js-properties` into a single file.

## Relevant URLs

* [BPMN.io example for custom bundles](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-bower-bundle)
* [bpmn-js](https://github.com/bpmn-io/bpmn-js)
* [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel)

## How do I set this project up?

### Prerequesites

* Node `>= 0.6.0`
* Grunt

### Setup/Installation

```shell
$ npm install
```

### Building

```shell
$ npm run build
```

This creates all bundled files in the `dist` folder.

## How do I use this project?

### Usage

```shell
$ npm install --save @process-engine/bpmn-js-custom-bundle
```

This will install the project in `node_modules`, we need to tell aurelia
how to load this bundle into the application:

```javascript
{
  "name": "@process-engine/bpmn-js-custom-bundle",
  "path": "../node_modules/@process-engine/bpmn-js-custom-bundle/dist",
  "main": "bpmn-modeler-custom.js",
  "resources": [
    "bpmn-modeler-custom.css",
    "bpmn-modeler-custom.js"
  ]
}
```

Inside your templates you can now use:

```html
<template>
  <require from="@process-engine/bpmn-js-custom-bundle/bpmn-modeler-custom.css"></require>  
  ...
</template>
```

And inside your javascript files:

```javascript
import * as BPMNModeler from '@process-engine/bpmn-js-custom-bundle';
```

### Publishing

```shell
$ npm run build
$ # bump version in package.json
$ npm publish
```

### Authors/Contact information?

- Paul Heidenreich <paul.heidenreich@5minds.de>
- Alexander Kasten <alexander.kasten@5minds.de>
