var rlite = require('./index');
var assert = require('assert');
var fs = require('fs');

var client = rlite.createClient(':memory:');

// null
assert(client.command(['get', 'key']) === null);

assert(client.command(['set', 'key', 'value']) === 'OK');

// string
assert(client.command(['get', 'key']) === 'value');

// integer
assert(client.command(['rpush', 'list', 'first', 'second', 'third']) === 3);

// list
var list = client.command(['lrange', 'list', '0', '-1'])
assert(list.length === 3);
assert(list[0] === 'first');
assert(list[1] === 'second');
assert(list[2] === 'third');

// error
assert(client.command(['set', 'key']) instanceof Error);

// persistence
var path = 'mydb.rld';

if (fs.existsSync(path)) {
    fs.unlinkSync(path);
}
client = rlite.createClient(path);
client.command(['set', 'key', 'value']);

client = rlite.createClient('mydb.rld');
assert(client.command(['get', 'key']) === 'value');

fs.unlinkSync(path);
