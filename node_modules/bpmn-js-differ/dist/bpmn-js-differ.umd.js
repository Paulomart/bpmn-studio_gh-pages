(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.BpmnJsDiffer = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Flatten array, one level deep.
   *
   * @param {Array<?>} arr
   *
   * @return {Array<?>}
   */

  var nativeToString = Object.prototype.toString;
  var nativeHasOwnProperty = Object.prototype.hasOwnProperty;

  function isUndefined(obj) {
    return obj === null || obj === undefined;
  }

  function isArray(obj) {
    return nativeToString.call(obj) === '[object Array]';
  }

  /**
   * Return true, if target owns a property with the given key.
   *
   * @param {Object} target
   * @param {String} key
   *
   * @return {Boolean}
   */
  function has(target, key) {
    return nativeHasOwnProperty.call(target, key);
  }

  /**
   * Iterate over collection; returning something
   * (non-undefined) will stop iteration.
   *
   * @param  {Array|Object} collection
   * @param  {Function} iterator
   *
   * @return {Object} return result that stopped the iteration
   */
  function forEach(collection, iterator) {

    if (isUndefined(collection)) {
      return;
    }

    var convertKey = isArray(collection) ? toNum : identity;

    for (var key in collection) {

      if (has(collection, key)) {
        var val = collection[key];

        var result = iterator(val, convertKey(key));

        if (result === false) {
          return;
        }
      }
    }
  }

  /**
   * Reduce collection, returning a single result.
   *
   * @param  {Object|Array} collection
   * @param  {Function} iterator
   * @param  {Any} result
   *
   * @return {Any} result returned from last iterator
   */
  function reduce(collection, iterator, result) {

    forEach(collection, function (value, idx) {
      result = iterator(result, value, idx);
    });

    return result;
  }

  function identity(arg) {
    return arg;
  }

  function toNum(arg) {
    return Number(arg);
  }

  class Processor {
    constructor(options) {
      this.selfOptions = options || {};
      this.pipes = {};
    }

    options(options) {
      if (options) {
        this.selfOptions = options;
      }
      return this.selfOptions;
    }

    pipe(name, pipeArg) {
      let pipe = pipeArg;
      if (typeof name === 'string') {
        if (typeof pipe === 'undefined') {
          return this.pipes[name];
        } else {
          this.pipes[name] = pipe;
        }
      }
      if (name && name.name) {
        pipe = name;
        if (pipe.processor === this) {
          return pipe;
        }
        this.pipes[pipe.name] = pipe;
      }
      pipe.processor = this;
      return pipe;
    }

    process(input, pipe) {
      let context = input;
      context.options = this.options();
      let nextPipe = pipe || input.pipe || 'default';
      let lastPipe;
      let lastContext;
      while (nextPipe) {
        if (typeof context.nextAfterChildren !== 'undefined') {
          // children processed and coming back to parent
          context.next = context.nextAfterChildren;
          context.nextAfterChildren = null;
        }

        if (typeof nextPipe === 'string') {
          nextPipe = this.pipe(nextPipe);
        }
        nextPipe.process(context);
        lastContext = context;
        lastPipe = nextPipe;
        nextPipe = null;
        if (context) {
          if (context.next) {
            context = context.next;
            nextPipe = lastContext.nextPipe || context.pipe || lastPipe;
          }
        }
      }
      return context.hasResult ? context.result : undefined;
    }
  }

  class Pipe {
    constructor(name) {
      this.name = name;
      this.filters = [];
    }

    process(input) {
      if (!this.processor) {
        throw new Error('add this pipe to a processor before using it');
      }
      let debug = this.debug;
      let length = this.filters.length;
      let context = input;
      for (let index = 0; index < length; index++) {
        let filter = this.filters[index];
        if (debug) {
          this.log(`filter: ${filter.filterName}`);
        }
        filter(context);
        if (typeof context === 'object' && context.exiting) {
          context.exiting = false;
          break;
        }
      }
      if (!context.next && this.resultCheck) {
        this.resultCheck(context);
      }
    }

    log(msg) {
      console.log(`[jsondiffpatch] ${this.name} pipe, ${msg}`);
    }

    append(...args) {
      this.filters.push(...args);
      return this;
    }

    prepend(...args) {
      this.filters.unshift(...args);
      return this;
    }

    indexOf(filterName) {
      if (!filterName) {
        throw new Error('a filter name is required');
      }
      for (let index = 0; index < this.filters.length; index++) {
        let filter = this.filters[index];
        if (filter.filterName === filterName) {
          return index;
        }
      }
      throw new Error(`filter not found: ${filterName}`);
    }

    list() {
      return this.filters.map(f => f.filterName);
    }

    after(filterName) {
      let index = this.indexOf(filterName);
      let params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index + 1, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }

    before(filterName) {
      let index = this.indexOf(filterName);
      let params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }

    replace(filterName) {
      let index = this.indexOf(filterName);
      let params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index, 1);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }

    remove(filterName) {
      let index = this.indexOf(filterName);
      this.filters.splice(index, 1);
      return this;
    }

    clear() {
      this.filters.length = 0;
      return this;
    }

    shouldHaveResult(should) {
      if (should === false) {
        this.resultCheck = null;
        return;
      }
      if (this.resultCheck) {
        return;
      }
      let pipe = this;
      this.resultCheck = context => {
        if (!context.hasResult) {
          console.log(context);
          let error = new Error(`${pipe.name} failed`);
          error.noResult = true;
          throw error;
        }
      };
      return this;
    }
  }

  class Context {
    setResult(result) {
      this.result = result;
      this.hasResult = true;
      return this;
    }

    exit() {
      this.exiting = true;
      return this;
    }

    switchTo(next, pipe) {
      if (typeof next === 'string' || next instanceof Pipe) {
        this.nextPipe = next;
      } else {
        this.next = next;
        if (pipe) {
          this.nextPipe = pipe;
        }
      }
      return this;
    }

    push(child, name) {
      child.parent = this;
      if (typeof name !== 'undefined') {
        child.childName = name;
      }
      child.root = this.root || this;
      child.options = child.options || this.options;
      if (!this.children) {
        this.children = [child];
        this.nextAfterChildren = this.next || null;
        this.next = child;
      } else {
        this.children[this.children.length - 1].next = child;
        this.children.push(child);
      }
      child.next = this;
      return this;
    }
  }

  const isArray$1 =
    typeof Array.isArray === 'function' ? Array.isArray : a => a instanceof Array;

  function cloneRegExp(re) {
    let regexMatch = /^\/(.*)\/([gimyu]*)$/.exec(re.toString());
    return new RegExp(regexMatch[1], regexMatch[2]);
  }

  function clone(arg) {
    if (typeof arg !== 'object') {
      return arg;
    }
    if (arg === null) {
      return null;
    }
    if (isArray$1(arg)) {
      return arg.map(clone);
    }
    if (arg instanceof Date) {
      return new Date(arg.getTime());
    }
    if (arg instanceof RegExp) {
      return cloneRegExp(arg);
    }
    let cloned = {};
    for (let name in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, name)) {
        cloned[name] = clone(arg[name]);
      }
    }
    return cloned;
  }

  class DiffContext extends Context {
    constructor(left, right) {
      super();
      this.left = left;
      this.right = right;
      this.pipe = 'diff';
    }

    setResult(result) {
      if (this.options.cloneDiffValues && typeof result === 'object') {
        const clone$$1 =
          typeof this.options.cloneDiffValues === 'function'
            ? this.options.cloneDiffValues
            : clone;
        if (typeof result[0] === 'object') {
          result[0] = clone$$1(result[0]);
        }
        if (typeof result[1] === 'object') {
          result[1] = clone$$1(result[1]);
        }
      }
      return Context.prototype.setResult.apply(this, arguments);
    }
  }

  class PatchContext extends Context {
    constructor(left, delta) {
      super();
      this.left = left;
      this.delta = delta;
      this.pipe = 'patch';
    }
  }

  class ReverseContext extends Context {
    constructor(delta) {
      super();
      this.delta = delta;
      this.pipe = 'reverse';
    }
  }

  const isArray$2 =
    typeof Array.isArray === 'function'
      ? Array.isArray
      : function(a) {
        return a instanceof Array;
      };

  const diffFilter = function trivialMatchesDiffFilter(context) {
    if (context.left === context.right) {
      context.setResult(undefined).exit();
      return;
    }
    if (typeof context.left === 'undefined') {
      if (typeof context.right === 'function') {
        throw new Error('functions are not supported');
      }
      context.setResult([context.right]).exit();
      return;
    }
    if (typeof context.right === 'undefined') {
      context.setResult([context.left, 0, 0]).exit();
      return;
    }
    if (
      typeof context.left === 'function' ||
      typeof context.right === 'function'
    ) {
      throw new Error('functions are not supported');
    }
    context.leftType = context.left === null ? 'null' : typeof context.left;
    context.rightType = context.right === null ? 'null' : typeof context.right;
    if (context.leftType !== context.rightType) {
      context.setResult([context.left, context.right]).exit();
      return;
    }
    if (context.leftType === 'boolean' || context.leftType === 'number') {
      context.setResult([context.left, context.right]).exit();
      return;
    }
    if (context.leftType === 'object') {
      context.leftIsArray = isArray$2(context.left);
    }
    if (context.rightType === 'object') {
      context.rightIsArray = isArray$2(context.right);
    }
    if (context.leftIsArray !== context.rightIsArray) {
      context.setResult([context.left, context.right]).exit();
      return;
    }

    if (context.left instanceof RegExp) {
      if (context.right instanceof RegExp) {
        context
          .setResult([context.left.toString(), context.right.toString()])
          .exit();
      } else {
        context.setResult([context.left, context.right]).exit();
      }
    }
  };
  diffFilter.filterName = 'trivial';

  const patchFilter = function trivialMatchesPatchFilter(context) {
    if (typeof context.delta === 'undefined') {
      context.setResult(context.left).exit();
      return;
    }
    context.nested = !isArray$2(context.delta);
    if (context.nested) {
      return;
    }
    if (context.delta.length === 1) {
      context.setResult(context.delta[0]).exit();
      return;
    }
    if (context.delta.length === 2) {
      if (context.left instanceof RegExp) {
        const regexArgs = /^\/(.*)\/([gimyu]+)$/.exec(context.delta[1]);
        if (regexArgs) {
          context.setResult(new RegExp(regexArgs[1], regexArgs[2])).exit();
          return;
        }
      }
      context.setResult(context.delta[1]).exit();
      return;
    }
    if (context.delta.length === 3 && context.delta[2] === 0) {
      context.setResult(undefined).exit();
    }
  };
  patchFilter.filterName = 'trivial';

  const reverseFilter = function trivialReferseFilter(context) {
    if (typeof context.delta === 'undefined') {
      context.setResult(context.delta).exit();
      return;
    }
    context.nested = !isArray$2(context.delta);
    if (context.nested) {
      return;
    }
    if (context.delta.length === 1) {
      context.setResult([context.delta[0], 0, 0]).exit();
      return;
    }
    if (context.delta.length === 2) {
      context.setResult([context.delta[1], context.delta[0]]).exit();
      return;
    }
    if (context.delta.length === 3 && context.delta[2] === 0) {
      context.setResult([context.delta[0]]).exit();
    }
  };
  reverseFilter.filterName = 'trivial';

  function collectChildrenDiffFilter(context) {
    if (!context || !context.children) {
      return;
    }
    const length = context.children.length;
    let child;
    let result = context.result;
    for (let index = 0; index < length; index++) {
      child = context.children[index];
      if (typeof child.result === 'undefined') {
        continue;
      }
      result = result || {};
      result[child.childName] = child.result;
    }
    if (result && context.leftIsArray) {
      result._t = 'a';
    }
    context.setResult(result).exit();
  }
  collectChildrenDiffFilter.filterName = 'collectChildren';

  function objectsDiffFilter(context) {
    if (context.leftIsArray || context.leftType !== 'object') {
      return;
    }

    let name;
    let child;
    const propertyFilter = context.options.propertyFilter;
    for (name in context.left) {
      if (!Object.prototype.hasOwnProperty.call(context.left, name)) {
        continue;
      }
      if (propertyFilter && !propertyFilter(name, context)) {
        continue;
      }
      child = new DiffContext(context.left[name], context.right[name]);
      context.push(child, name);
    }
    for (name in context.right) {
      if (!Object.prototype.hasOwnProperty.call(context.right, name)) {
        continue;
      }
      if (propertyFilter && !propertyFilter(name, context)) {
        continue;
      }
      if (typeof context.left[name] === 'undefined') {
        child = new DiffContext(undefined, context.right[name]);
        context.push(child, name);
      }
    }

    if (!context.children || context.children.length === 0) {
      context.setResult(undefined).exit();
      return;
    }
    context.exit();
  }
  objectsDiffFilter.filterName = 'objects';

  const patchFilter$1 = function nestedPatchFilter(context) {
    if (!context.nested) {
      return;
    }
    if (context.delta._t) {
      return;
    }
    let name;
    let child;
    for (name in context.delta) {
      child = new PatchContext(context.left[name], context.delta[name]);
      context.push(child, name);
    }
    context.exit();
  };
  patchFilter$1.filterName = 'objects';

  const collectChildrenPatchFilter = function collectChildrenPatchFilter(
    context
  ) {
    if (!context || !context.children) {
      return;
    }
    if (context.delta._t) {
      return;
    }
    let length = context.children.length;
    let child;
    for (let index = 0; index < length; index++) {
      child = context.children[index];
      if (
        Object.prototype.hasOwnProperty.call(context.left, child.childName) &&
        child.result === undefined
      ) {
        delete context.left[child.childName];
      } else if (context.left[child.childName] !== child.result) {
        context.left[child.childName] = child.result;
      }
    }
    context.setResult(context.left).exit();
  };
  collectChildrenPatchFilter.filterName = 'collectChildren';

  const reverseFilter$1 = function nestedReverseFilter(context) {
    if (!context.nested) {
      return;
    }
    if (context.delta._t) {
      return;
    }
    let name;
    let child;
    for (name in context.delta) {
      child = new ReverseContext(context.delta[name]);
      context.push(child, name);
    }
    context.exit();
  };
  reverseFilter$1.filterName = 'objects';

  function collectChildrenReverseFilter(context) {
    if (!context || !context.children) {
      return;
    }
    if (context.delta._t) {
      return;
    }
    let length = context.children.length;
    let child;
    let delta = {};
    for (let index = 0; index < length; index++) {
      child = context.children[index];
      if (delta[child.childName] !== child.result) {
        delta[child.childName] = child.result;
      }
    }
    context.setResult(delta).exit();
  }
  collectChildrenReverseFilter.filterName = 'collectChildren';

  /*

  LCS implementation that supports arrays or strings

  reference: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem

  */

  const defaultMatch = function(array1, array2, index1, index2) {
    return array1[index1] === array2[index2];
  };

  const lengthMatrix = function(array1, array2, match, context) {
    const len1 = array1.length;
    const len2 = array2.length;
    let x, y;

    // initialize empty matrix of len1+1 x len2+1
    let matrix = [len1 + 1];
    for (x = 0; x < len1 + 1; x++) {
      matrix[x] = [len2 + 1];
      for (y = 0; y < len2 + 1; y++) {
        matrix[x][y] = 0;
      }
    }
    matrix.match = match;
    // save sequence lengths for each coordinate
    for (x = 1; x < len1 + 1; x++) {
      for (y = 1; y < len2 + 1; y++) {
        if (match(array1, array2, x - 1, y - 1, context)) {
          matrix[x][y] = matrix[x - 1][y - 1] + 1;
        } else {
          matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
        }
      }
    }
    return matrix;
  };

  const backtrack = function(matrix, array1, array2, index1, index2, context) {
    if (index1 === 0 || index2 === 0) {
      return {
        sequence: [],
        indices1: [],
        indices2: [],
      };
    }

    if (matrix.match(array1, array2, index1 - 1, index2 - 1, context)) {
      const subsequence = backtrack(
        matrix,
        array1,
        array2,
        index1 - 1,
        index2 - 1,
        context
      );
      subsequence.sequence.push(array1[index1 - 1]);
      subsequence.indices1.push(index1 - 1);
      subsequence.indices2.push(index2 - 1);
      return subsequence;
    }

    if (matrix[index1][index2 - 1] > matrix[index1 - 1][index2]) {
      return backtrack(matrix, array1, array2, index1, index2 - 1, context);
    } else {
      return backtrack(matrix, array1, array2, index1 - 1, index2, context);
    }
  };

  const get = function(array1, array2, match, context) {
    const innerContext = context || {};
    const matrix = lengthMatrix(
      array1,
      array2,
      match || defaultMatch,
      innerContext
    );
    const result = backtrack(
      matrix,
      array1,
      array2,
      array1.length,
      array2.length,
      innerContext
    );
    if (typeof array1 === 'string' && typeof array2 === 'string') {
      result.sequence = result.sequence.join('');
    }
    return result;
  };

  var lcs = {
    get: get,
  };

  const ARRAY_MOVE = 3;

  const isArray$3 =
    typeof Array.isArray === 'function' ? Array.isArray : a => a instanceof Array;

  const arrayIndexOf =
    typeof Array.prototype.indexOf === 'function'
      ? (array, item) => array.indexOf(item)
      : (array, item) => {
        let length = array.length;
        for (let i = 0; i < length; i++) {
          if (array[i] === item) {
            return i;
          }
        }
        return -1;
      };

  function arraysHaveMatchByRef(array1, array2, len1, len2) {
    for (let index1 = 0; index1 < len1; index1++) {
      let val1 = array1[index1];
      for (let index2 = 0; index2 < len2; index2++) {
        let val2 = array2[index2];
        if (index1 !== index2 && val1 === val2) {
          return true;
        }
      }
    }
  }

  function matchItems(array1, array2, index1, index2, context) {
    let value1 = array1[index1];
    let value2 = array2[index2];
    if (value1 === value2) {
      return true;
    }
    if (typeof value1 !== 'object' || typeof value2 !== 'object') {
      return false;
    }
    let objectHash = context.objectHash;
    if (!objectHash) {
      // no way to match objects was provided, try match by position
      return context.matchByPosition && index1 === index2;
    }
    let hash1;
    let hash2;
    if (typeof index1 === 'number') {
      context.hashCache1 = context.hashCache1 || [];
      hash1 = context.hashCache1[index1];
      if (typeof hash1 === 'undefined') {
        context.hashCache1[index1] = hash1 = objectHash(value1, index1);
      }
    } else {
      hash1 = objectHash(value1);
    }
    if (typeof hash1 === 'undefined') {
      return false;
    }
    if (typeof index2 === 'number') {
      context.hashCache2 = context.hashCache2 || [];
      hash2 = context.hashCache2[index2];
      if (typeof hash2 === 'undefined') {
        context.hashCache2[index2] = hash2 = objectHash(value2, index2);
      }
    } else {
      hash2 = objectHash(value2);
    }
    if (typeof hash2 === 'undefined') {
      return false;
    }
    return hash1 === hash2;
  }

  const diffFilter$1 = function arraysDiffFilter(context) {
    if (!context.leftIsArray) {
      return;
    }

    let matchContext = {
      objectHash: context.options && context.options.objectHash,
      matchByPosition: context.options && context.options.matchByPosition,
    };
    let commonHead = 0;
    let commonTail = 0;
    let index;
    let index1;
    let index2;
    let array1 = context.left;
    let array2 = context.right;
    let len1 = array1.length;
    let len2 = array2.length;

    let child;

    if (
      len1 > 0 &&
      len2 > 0 &&
      !matchContext.objectHash &&
      typeof matchContext.matchByPosition !== 'boolean'
    ) {
      matchContext.matchByPosition = !arraysHaveMatchByRef(
        array1,
        array2,
        len1,
        len2
      );
    }

    // separate common head
    while (
      commonHead < len1 &&
      commonHead < len2 &&
      matchItems(array1, array2, commonHead, commonHead, matchContext)
    ) {
      index = commonHead;
      child = new DiffContext(context.left[index], context.right[index]);
      context.push(child, index);
      commonHead++;
    }
    // separate common tail
    while (
      commonTail + commonHead < len1 &&
      commonTail + commonHead < len2 &&
      matchItems(
        array1,
        array2,
        len1 - 1 - commonTail,
        len2 - 1 - commonTail,
        matchContext
      )
    ) {
      index1 = len1 - 1 - commonTail;
      index2 = len2 - 1 - commonTail;
      child = new DiffContext(context.left[index1], context.right[index2]);
      context.push(child, index2);
      commonTail++;
    }
    let result;
    if (commonHead + commonTail === len1) {
      if (len1 === len2) {
        // arrays are identical
        context.setResult(undefined).exit();
        return;
      }
      // trivial case, a block (1 or more consecutive items) was added
      result = result || {
        _t: 'a',
      };
      for (index = commonHead; index < len2 - commonTail; index++) {
        result[index] = [array2[index]];
      }
      context.setResult(result).exit();
      return;
    }
    if (commonHead + commonTail === len2) {
      // trivial case, a block (1 or more consecutive items) was removed
      result = result || {
        _t: 'a',
      };
      for (index = commonHead; index < len1 - commonTail; index++) {
        result[`_${index}`] = [array1[index], 0, 0];
      }
      context.setResult(result).exit();
      return;
    }
    // reset hash cache
    delete matchContext.hashCache1;
    delete matchContext.hashCache2;

    // diff is not trivial, find the LCS (Longest Common Subsequence)
    let trimmed1 = array1.slice(commonHead, len1 - commonTail);
    let trimmed2 = array2.slice(commonHead, len2 - commonTail);
    let seq = lcs.get(trimmed1, trimmed2, matchItems, matchContext);
    let removedItems = [];
    result = result || {
      _t: 'a',
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
        // removed
        result[`_${index}`] = [array1[index], 0, 0];
        removedItems.push(index);
      }
    }

    let detectMove = true;
    if (
      context.options &&
      context.options.arrays &&
      context.options.arrays.detectMove === false
    ) {
      detectMove = false;
    }
    let includeValueOnMove = false;
    if (
      context.options &&
      context.options.arrays &&
      context.options.arrays.includeValueOnMove
    ) {
      includeValueOnMove = true;
    }

    let removedItemsLength = removedItems.length;
    for (index = commonHead; index < len2 - commonTail; index++) {
      let indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
      if (indexOnArray2 < 0) {
        // added, try to match with a removed item and register as position move
        let isMove = false;
        if (detectMove && removedItemsLength > 0) {
          for (
            let removeItemIndex1 = 0;
            removeItemIndex1 < removedItemsLength;
            removeItemIndex1++
          ) {
            index1 = removedItems[removeItemIndex1];
            if (
              matchItems(
                trimmed1,
                trimmed2,
                index1 - commonHead,
                index - commonHead,
                matchContext
              )
            ) {
              // store position move as: [originalValue, newPosition, ARRAY_MOVE]
              result[`_${index1}`].splice(1, 2, index, ARRAY_MOVE);
              if (!includeValueOnMove) {
                // don't include moved value on diff, to save bytes
                result[`_${index1}`][0] = '';
              }

              index2 = index;
              child = new DiffContext(
                context.left[index1],
                context.right[index2]
              );
              context.push(child, index2);
              removedItems.splice(removeItemIndex1, 1);
              isMove = true;
              break;
            }
          }
        }
        if (!isMove) {
          // added
          result[index] = [array2[index]];
        }
      } else {
        // match, do inner diff
        index1 = seq.indices1[indexOnArray2] + commonHead;
        index2 = seq.indices2[indexOnArray2] + commonHead;
        child = new DiffContext(context.left[index1], context.right[index2]);
        context.push(child, index2);
      }
    }

    context.setResult(result).exit();
  };
  diffFilter$1.filterName = 'arrays';

  let compare = {
    numerically(a, b) {
      return a - b;
    },
    numericallyBy(name) {
      return (a, b) => a[name] - b[name];
    },
  };

  const patchFilter$2 = function nestedPatchFilter(context) {
    if (!context.nested) {
      return;
    }
    if (context.delta._t !== 'a') {
      return;
    }
    let index;
    let index1;

    let delta = context.delta;
    let array = context.left;

    // first, separate removals, insertions and modifications
    let toRemove = [];
    let toInsert = [];
    let toModify = [];
    for (index in delta) {
      if (index !== '_t') {
        if (index[0] === '_') {
          // removed item from original array
          if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE) {
            toRemove.push(parseInt(index.slice(1), 10));
          } else {
            throw new Error(
              `only removal or move can be applied at original array indices,` +
                ` invalid diff type: ${delta[index][2]}`
            );
          }
        } else {
          if (delta[index].length === 1) {
            // added item at new array
            toInsert.push({
              index: parseInt(index, 10),
              value: delta[index][0],
            });
          } else {
            // modified item at new array
            toModify.push({
              index: parseInt(index, 10),
              delta: delta[index],
            });
          }
        }
      }
    }

    // remove items, in reverse order to avoid sawing our own floor
    toRemove = toRemove.sort(compare.numerically);
    for (index = toRemove.length - 1; index >= 0; index--) {
      index1 = toRemove[index];
      let indexDiff = delta[`_${index1}`];
      let removedValue = array.splice(index1, 1)[0];
      if (indexDiff[2] === ARRAY_MOVE) {
        // reinsert later
        toInsert.push({
          index: indexDiff[1],
          value: removedValue,
        });
      }
    }

    // insert items, in reverse order to avoid moving our own floor
    toInsert = toInsert.sort(compare.numericallyBy('index'));
    let toInsertLength = toInsert.length;
    for (index = 0; index < toInsertLength; index++) {
      let insertion = toInsert[index];
      array.splice(insertion.index, 0, insertion.value);
    }

    // apply modifications
    let toModifyLength = toModify.length;
    let child;
    if (toModifyLength > 0) {
      for (index = 0; index < toModifyLength; index++) {
        let modification = toModify[index];
        child = new PatchContext(
          context.left[modification.index],
          modification.delta
        );
        context.push(child, modification.index);
      }
    }

    if (!context.children) {
      context.setResult(context.left).exit();
      return;
    }
    context.exit();
  };
  patchFilter$2.filterName = 'arrays';

  const collectChildrenPatchFilter$1 = function collectChildrenPatchFilter(
    context
  ) {
    if (!context || !context.children) {
      return;
    }
    if (context.delta._t !== 'a') {
      return;
    }
    let length = context.children.length;
    let child;
    for (let index = 0; index < length; index++) {
      child = context.children[index];
      context.left[child.childName] = child.result;
    }
    context.setResult(context.left).exit();
  };
  collectChildrenPatchFilter$1.filterName = 'arraysCollectChildren';

  const reverseFilter$2 = function arraysReverseFilter(context) {
    if (!context.nested) {
      if (context.delta[2] === ARRAY_MOVE) {
        context.newName = `_${context.delta[1]}`;
        context
          .setResult([
            context.delta[0],
            parseInt(context.childName.substr(1), 10),
            ARRAY_MOVE,
          ])
          .exit();
      }
      return;
    }
    if (context.delta._t !== 'a') {
      return;
    }
    let name;
    let child;
    for (name in context.delta) {
      if (name === '_t') {
        continue;
      }
      child = new ReverseContext(context.delta[name]);
      context.push(child, name);
    }
    context.exit();
  };
  reverseFilter$2.filterName = 'arrays';

  let reverseArrayDeltaIndex = (delta, index, itemDelta) => {
    if (typeof index === 'string' && index[0] === '_') {
      return parseInt(index.substr(1), 10);
    } else if (isArray$3(itemDelta) && itemDelta[2] === 0) {
      return `_${index}`;
    }

    let reverseIndex = +index;
    for (let deltaIndex in delta) {
      let deltaItem = delta[deltaIndex];
      if (isArray$3(deltaItem)) {
        if (deltaItem[2] === ARRAY_MOVE) {
          let moveFromIndex = parseInt(deltaIndex.substr(1), 10);
          let moveToIndex = deltaItem[1];
          if (moveToIndex === +index) {
            return moveFromIndex;
          }
          if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
            reverseIndex++;
          } else if (
            moveFromIndex >= reverseIndex &&
            moveToIndex < reverseIndex
          ) {
            reverseIndex--;
          }
        } else if (deltaItem[2] === 0) {
          let deleteIndex = parseInt(deltaIndex.substr(1), 10);
          if (deleteIndex <= reverseIndex) {
            reverseIndex++;
          }
        } else if (deltaItem.length === 1 && deltaIndex <= reverseIndex) {
          reverseIndex--;
        }
      }
    }

    return reverseIndex;
  };

  function collectChildrenReverseFilter$1(context) {
    if (!context || !context.children) {
      return;
    }
    if (context.delta._t !== 'a') {
      return;
    }
    let length = context.children.length;
    let child;
    let delta = {
      _t: 'a',
    };

    for (let index = 0; index < length; index++) {
      child = context.children[index];
      let name = child.newName;
      if (typeof name === 'undefined') {
        name = reverseArrayDeltaIndex(
          context.delta,
          child.childName,
          child.result
        );
      }
      if (delta[name] !== child.result) {
        delta[name] = child.result;
      }
    }
    context.setResult(delta).exit();
  }
  collectChildrenReverseFilter$1.filterName = 'arraysCollectChildren';

  const diffFilter$2 = function datesDiffFilter(context) {
    if (context.left instanceof Date) {
      if (context.right instanceof Date) {
        if (context.left.getTime() !== context.right.getTime()) {
          context.setResult([context.left, context.right]);
        } else {
          context.setResult(undefined);
        }
      } else {
        context.setResult([context.left, context.right]);
      }
      context.exit();
    } else if (context.right instanceof Date) {
      context.setResult([context.left, context.right]).exit();
    }
  };
  diffFilter$2.filterName = 'dates';

  var dmp = null;

  /* global diff_match_patch */

  let TEXT_DIFF = 2;
  let DEFAULT_MIN_LENGTH = 60;
  let cachedDiffPatch = null;

  let getDiffMatchPatch = function(required) {
    /* jshint camelcase: false */

    if (!cachedDiffPatch) {
      let instance;
      /* eslint-disable camelcase, new-cap */
      if (typeof diff_match_patch !== 'undefined') {
        // already loaded, probably a browser
        instance =
          typeof diff_match_patch === 'function'
            ? new diff_match_patch()
            : new diff_match_patch.diff_match_patch();
      } else if (dmp) {
        try {
          instance = dmp && new dmp();
        } catch (err) {
          instance = null;
        }
      }
      /* eslint-enable camelcase, new-cap */
      if (!instance) {
        if (!required) {
          return null;
        }
        let error = new Error('text diff_match_patch library not found');
        // eslint-disable-next-line camelcase
        error.diff_match_patch_not_found = true;
        throw error;
      }
      cachedDiffPatch = {
        diff: function(txt1, txt2) {
          return instance.patch_toText(instance.patch_make(txt1, txt2));
        },
        patch: function(txt1, patch) {
          let results = instance.patch_apply(
            instance.patch_fromText(patch),
            txt1
          );
          for (let i = 0; i < results[1].length; i++) {
            if (!results[1][i]) {
              let error = new Error('text patch failed');
              error.textPatchFailed = true;
            }
          }
          return results[0];
        },
      };
    }
    return cachedDiffPatch;
  };

  const diffFilter$3 = function textsDiffFilter(context) {
    if (context.leftType !== 'string') {
      return;
    }
    let minLength =
      (context.options &&
        context.options.textDiff &&
        context.options.textDiff.minLength) ||
      DEFAULT_MIN_LENGTH;
    if (context.left.length < minLength || context.right.length < minLength) {
      context.setResult([context.left, context.right]).exit();
      return;
    }
    // large text, try to use a text-diff algorithm
    let diffMatchPatch = getDiffMatchPatch();
    if (!diffMatchPatch) {
      // diff-match-patch library not available,
      // fallback to regular string replace
      context.setResult([context.left, context.right]).exit();
      return;
    }
    let diff = diffMatchPatch.diff;
    context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
  };
  diffFilter$3.filterName = 'texts';

  const patchFilter$3 = function textsPatchFilter(context) {
    if (context.nested) {
      return;
    }
    if (context.delta[2] !== TEXT_DIFF) {
      return;
    }

    // text-diff, use a text-patch algorithm
    const patch = getDiffMatchPatch(true).patch;
    context.setResult(patch(context.left, context.delta[0])).exit();
  };
  patchFilter$3.filterName = 'texts';

  const textDeltaReverse = function(delta) {
    let i;
    let l;
    let lines;
    let line;
    let lineTmp;
    let header = null;
    const headerRegex = /^@@ +-(\d+),(\d+) +\+(\d+),(\d+) +@@$/;
    let lineHeader;
    lines = delta.split('\n');
    for (i = 0, l = lines.length; i < l; i++) {
      line = lines[i];
      let lineStart = line.slice(0, 1);
      if (lineStart === '@') {
        header = headerRegex.exec(line);
        lineHeader = i;

        // fix header
        lines[lineHeader] =
          '@@ -' +
          header[3] +
          ',' +
          header[4] +
          ' +' +
          header[1] +
          ',' +
          header[2] +
          ' @@';
      } else if (lineStart === '+') {
        lines[i] = '-' + lines[i].slice(1);
        if (lines[i - 1].slice(0, 1) === '+') {
          // swap lines to keep default order (-+)
          lineTmp = lines[i];
          lines[i] = lines[i - 1];
          lines[i - 1] = lineTmp;
        }
      } else if (lineStart === '-') {
        lines[i] = '+' + lines[i].slice(1);
      }
    }
    return lines.join('\n');
  };

  const reverseFilter$3 = function textsReverseFilter(context) {
    if (context.nested) {
      return;
    }
    if (context.delta[2] !== TEXT_DIFF) {
      return;
    }

    // text-diff, use a text-diff algorithm
    context.setResult([textDeltaReverse(context.delta[0]), 0, TEXT_DIFF]).exit();
  };
  reverseFilter$3.filterName = 'texts';

  class DiffPatcher {
    constructor(options) {
      this.processor = new Processor(options);
      this.processor.pipe(
        new Pipe('diff')
          .append(
            collectChildrenDiffFilter,
            diffFilter,
            diffFilter$2,
            diffFilter$3,
            objectsDiffFilter,
            diffFilter$1
          )
          .shouldHaveResult()
      );
      this.processor.pipe(
        new Pipe('patch')
          .append(
            collectChildrenPatchFilter,
            collectChildrenPatchFilter$1,
            patchFilter,
            patchFilter$3,
            patchFilter$1,
            patchFilter$2
          )
          .shouldHaveResult()
      );
      this.processor.pipe(
        new Pipe('reverse')
          .append(
            collectChildrenReverseFilter,
            collectChildrenReverseFilter$1,
            reverseFilter,
            reverseFilter$3,
            reverseFilter$1,
            reverseFilter$2
          )
          .shouldHaveResult()
      );
    }

    options(...args) {
      return this.processor.options(...args);
    }

    diff(left, right) {
      return this.processor.process(new DiffContext(left, right));
    }

    patch(left, delta) {
      return this.processor.process(new PatchContext(left, delta));
    }

    reverse(delta) {
      return this.processor.process(new ReverseContext(delta));
    }

    unpatch(right, delta) {
      return this.patch(right, this.reverse(delta));
    }

    clone(value) {
      return clone(value);
    }
  }

  // use as 2nd parameter for JSON.parse to revive Date instances

  /* eslint no-cond-assign: 0 */

  function is(element, type) {
    return element.$instanceOf(type);
  }

  function isAny(element, types) {
    return types.some(function(t) {
      return is(element, t);
    });
  }

  function isDi(element) {
    return isAny(element, [
      'bpmndi:BPMNEdge',
      'bpmndi:BPMNShape'
    ]);
  }

  function getTrackedProcessVisual(processElement) {

    var definitions = processElement.$parent;

    var collaboration = definitions.rootElements.find(function(el) {
      return is(el, 'bpmn:Collaboration');
    });

    // we track the process, too
    if (!collaboration) {
      return {
        element: processElement,
        property: ''
      };
    }

    var participant = collaboration.participants.find(function(el) {
      return el.processRef === processElement;
    });

    return participant && {
      element: participant,
      property: 'processRef.'
    };
  }

  function isTracked(element) {

    // a bpmn:FlowElement without visual representation
    if (is(element, 'bpmn:DataObject')) {
      return false;
    }

    // track referencing bpmn:Participant instead of
    // bpmn:Process in collaboration diagrams
    if (is(element, 'bpmn:Process')) {
      return getTrackedProcessVisual(element);
    }

    var track = isAny(element, [
      'bpmn:Participant',
      'bpmn:Collaboration',
      'bpmn:FlowElement',
      'bpmn:SequenceFlow',
      'bpmn:MessageFlow',
      'bpmn:Participant',
      'bpmn:Lane',
      'bpmn:DataAssociation'
    ]);

    if (track) {
      return {
        element: element,
        property: ''
      };
    }
  }

  function ChangeHandler() {
    this._layoutChanged = {};
    this._changed = {};
    this._removed = {};
    this._added = {};
  }


  ChangeHandler.prototype.removed = function(model, property, element, idx) {

    var tracked;

    if (tracked = isTracked(element)) {
      if (!this._removed[tracked.element.id]) {
        this._removed[tracked.element.id] = element;
      }
    } else

    if (tracked = isTracked(model)) {
      this.changed(tracked.element, tracked.property + property + '[' + idx + ']', null, element);
    } else

    if (isDi(model) && property === 'waypoint') {
      this._layoutChanged[model.bpmnElement.id] = model.bpmnElement;
    }
  };

  ChangeHandler.prototype.changed = function(model, property, newValue, oldValue) {

    var tracked;

    if (isDi(model)) {
      this._layoutChanged[model.bpmnElement.id] = model.bpmnElement;
    } else

    if (tracked = isTracked(model)) {
      var changed = this._changed[tracked.element.id];

      if (!changed) {
        changed = this._changed[tracked.element.id] = { model: model, attrs: { } };
      }

      if (oldValue !== undefined || newValue !== undefined) {
        changed.attrs[property] = { oldValue: oldValue, newValue: newValue };
      }
    }
  };

  ChangeHandler.prototype.added = function(model, property, element, idx) {

    var tracked;

    if (tracked = isTracked(element)) {
      if (!this._added[tracked.element.id]) {
        this._added[tracked.element.id] = element;
      }
    } else

    if (tracked = isTracked(model)) {
      this.changed(tracked.element, tracked.property + property + '[' + idx + ']', element, null);
    } else

    if (isDi(model) && property === 'waypoint') {
      this._layoutChanged[model.bpmnElement.id] = model.bpmnElement;
    }
  };

  ChangeHandler.prototype.moved = function(model, property, oldIndex, newIndex) {
    // noop
  };

  function Differ() { }


  Differ.prototype.createDiff = function(a, b) {

    // create a configured instance, match objects by name
    var diffpatcher = new DiffPatcher({
      objectHash: function(obj) {
        return obj.id || JSON.stringify(obj);
      },
      propertyFilter: function(name, context) {
        return name !== '$instanceOf';
      }
    });

    return diffpatcher.diff(a, b);
  };


  Differ.prototype.diff = function(a, b, handler) {

    handler = handler || new ChangeHandler();

    function walk(diff$$1, model) {

      forEach(diff$$1, function(d, key) {

        if (d._t !== 'a' && isArray(d)) {

          // take into account that collection properties are lazily
          // initialized; this means that adding to an empty collection
          // looks like setting an undefined variable to []
          //
          // ensure we detect this case and change it to an array diff
          if (isArray(d[0])) {

            d = reduce(d[0], function(newDelta, element, idx) {
              var prefix = d.length === 3 ? '_' : '';

              newDelta[prefix + idx] = [ element ];

              return newDelta;
            }, { _t: 'a' });
          }

        }


        // is array
        if (d._t === 'a') {

          forEach(d, function(val, idx) {

            if (idx === '_t') {
              return;
            }

            var removed = /^_/.test(idx),
                added = !removed && isArray(val),
                moved = removed && val[0] === '';

            idx = parseInt(removed ? idx.slice(1) : idx, 10);

            if (added || (removed && !moved)) {
              handler[removed ? 'removed' : 'added'](model, key, val[0], idx);
            } else
            if (moved) {
              handler.moved(model, key, val[1], val[2]);
            } else {
              walk(val, model[key][idx]);
            }
          });
        } else {
          if (isArray(d)) {
            handler.changed(model, key, d[0], d[1]);
          } else {
            handler.changed(model, key);
            walk(d, model[key]);
          }
        }
      });
    }

    var diff$$1 = this.createDiff(a, b);

    walk(diff$$1, b, handler);

    return handler;
  };

  function diff$1(a, b, handler) {
    return new Differ().diff(a, b, handler);
  }

  exports.Differ = Differ;
  exports.diff = diff$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
