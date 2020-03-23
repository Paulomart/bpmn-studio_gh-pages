# eslint-plugin-6river

set of 6river eslint plugins

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-6river`:

```
$ npm install eslint-plugin-6river --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-6river` globally.

## Usage

Add `6river` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "6river"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "6river/rule-name": 2
    }
}
```

## Supported Rules

* new-cap - same as eslint core rule but adds @ prefix to decorator function while parsed to make it easy to apply regex rules for all decorators.
