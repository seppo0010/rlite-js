# rlite-js

[![Build Status](https://travis-ci.org/seppo0010/rlite-js.svg?branch=master)](https://travis-ci.org/seppo0010/rlite-js)

Ruby bindings for rlite. For more information about rlite, go to
[rlite repository](https://github.com/seppo0010/rlite)

## Installation

```bash
$ npm install hirlite
```

## Usage

```js
> var rlite = require('rlite');
undefined
> var r = rlite.createClient(':memory:')
undefined
> r.command(['set', 'key', 'value'])
'OK'
> r.command(['get', 'key'])
'value'
```
