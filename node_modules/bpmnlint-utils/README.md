# bpmnlint-utils

[![Build Status](https://travis-ci.org/bpmn-io/bpmnlint-utils.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmnlint-utils)

Utilities for creating bpmnlint rules.


## Usage

```javascript
import {
  is,
  isAny
} from 'bpmnlint-utils';

is(moddleElement, 'bpmn:ServiceTask'); // true || false
isAny(moddleElement, [ 'bpmn:Task', 'bpmn:Event' ]); // true || false
```


## License

MIT
