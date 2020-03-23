module.exports  = {
  extends: [require.resolve('eslint-config-airbnb-base')],
  env: {
    node: true,
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['no-null', '@typescript-eslint', '6river'],
  rules: {
    // NodeJS Rules
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': ['off'],
    'class-methods-use-this': ['off'],
    'curly': ['error', 'all'],
    'complexity': ['error', 30],
    'eqeqeq': ['off'],
    'function-paren-newline': ['error', 'multiline'],
    'implicit-arrow-linebreak': ['off'],
    'import/extensions': [
      'error',
      'never',
      { 'json': 'ignorePackages' },
    ],
    'import/no-extraneous-dependencies': ['off'],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}],
    'max-classes-per-file': ['off'],
    'max-len': [2, 150, 2, {
      ignoreUrls: true,
      ignoreComments: false,
    }],
    'max-lines': ['error', {
      max: 1000,
      skipBlankLines: false,
      skipComments: false,
    }],
    'new-cap': 'off',
    '6river/new-cap': ['error', {
      newIsCap: true,
      // this allows decorators to start with an upper case letter
      capIsNewExceptionPattern: '(@\\w+)'
    }],
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
    'nonblock-statement-body-position': ['off'],
    'no-async-promise-executor': ['off'],
    'no-await-in-loop': ['off'],
    'no-bitwise': ['error', {allow: ['~', '^', '|', '&', '|=', '&=', '^=']}],
    'no-case-declarations': ['off'],
    'no-confusing-arrow': ['error', {allowParens: false}],
    'no-continue': ['off'],
    'no-multiple-empty-lines': ['error', {max: 1}],
    'no-new-func': ['off'],
    'no-magic-numbers': 'off',
    'no-null/no-null': ['off'],
    'no-param-reassign': ['off'],
    'no-plusplus': ['off'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-underscore-dangle': ['error', {allowAfterThis: true}],
    'no-unused-vars': 'off',
    'no-use-before-define': ['off'],
    'no-void': ['off'],
    'object-shorthand': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'operator-linebreak': ['off'],
    'padded-blocks': ['error', {classes: 'always'}],
    'prefer-destructuring': ['off'],
    'prefer-object-spread':  ['off'],
    'radix': ['error', 'as-needed'],
    'require-await': ['off'],
    'sort-imports': ['error', {'ignoreDeclarationSort': true}],
    'strict': 'off',
    // Typescript Rules
    '@typescript-eslint/adjacent-overload-signatures': ['error'],
    '@typescript-eslint/array-type': ['error', {'default': 'generic'}],
    '@typescript-eslint/ban-types': ['error', {
      'types': {
        Object: 'Use object instead.',
        String: 'Use \'string\' instead.',
        Number: 'Use \'number\' instead.',
        Boolean: 'Use \'boolean\' instead.'
      }
    }],
    '@typescript-eslint/ban-ts-ignore': ['error'],
    camelcase: 'off',
    '@typescript-eslint/camelcase': ['error', { 'properties': 'always' }],
    '@typescript-eslint/class-name-casing': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/explicit-member-accessibility': ['error', {'overrides': {'constructors': 'no-public'}}],
    '@typescript-eslint/generic-type-naming': ['error', '^T[A-Z][a-zA-Z]+$'],
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      }
    }],
    '@typescript-eslint/member-naming': ['error', {
      private: '^[a-z]',
      protected: '^[a-z]',
      public: '^[a-z]',
    }],
    '@typescript-eslint/member-ordering': ['error', {
      default: [
         // Fields
        'public-static-field',
        'protected-static-field',
        'private-static-field',
        'public-instance-field',
        'protected-instance-field',
        'private-instance-field',

        'public-field',
        'protected-field',
        'private-field',
        'static-field',
        'instance-field',
        'field',

        'constructor',

        'static-method',
        'instance-method'
      ]
    }],
    '@typescript-eslint/no-array-constructor': ['error'],
    '@typescript-eslint/no-empty-interface': ['error'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-extraneous-class': ['error'],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-inferrable-types': ['error', {'ignoreParameters': true}],
    '@typescript-eslint/no-magic-numbers': ['off'],
    '@typescript-eslint/no-misused-new': ['error'],
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['error'],
    '@typescript-eslint/consistent-type-assertions': ['off'],
    '@typescript-eslint/no-parameter-properties': ['error'],
    '@typescript-eslint/no-require-imports': ['error'],
    '@typescript-eslint/no-this-alias': ['error'],
    '@typescript-eslint/triple-slash-reference': ['error', {'path': 'never', 'types': 'never', 'lib': 'never'}],
    '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/no-var-requires': ['error'],
    '@typescript-eslint/prefer-for-of': ['error'],
    '@typescript-eslint/prefer-function-type': ['error'],
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-interface': ['off'],
    '@typescript-eslint/consistent-type-definitions': ['off'],
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/type-annotation-spacing': ['error'],
    '@typescript-eslint/typedef': ['error', {
      arrayDestructuring: false,
      arrowParameter: false,
      memberVariableDeclaration: false,
      objectDestructuring: false,
      parameter: false,
      propertyDeclaration: true,
      variableDeclaration: false,
    }],
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/unified-signatures': ['error']
  },
  // make eslint recognize typescript files
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
}
