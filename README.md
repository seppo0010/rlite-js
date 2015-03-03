# rlite-js

[![Build Status](https://travis-ci.org/seppo0010/rlite-js.svg?branch=master)](https://travis-ci.org/seppo0010/rlite-js)

node.js bindings for rlite. For more information about rlite, go to
[rlite repository](https://github.com/seppo0010/rlite)

## Installation

```bash
$ npm install rlite
```

## Usage

```js
> var rlite = require('rlite');
undefined
> var r = rlite.createClient(':memory:');
undefined
> r.command(['set', 'key', 'value'], function(err, ret) {
        if (!err) {
            r.command(['get', 'key'], function(err, ret) {
                console.log(ret)
            });
        }
});
undefined
> value
```

### Synchronically

```js
> var rlite = require('rlite');
undefined
> var r = rlite.createClient(':memory:');
undefined
> r.commandSync(['set', 'key', 'value']);
'OK'
> r.commandSync(['get', 'key']);
'value'
```
