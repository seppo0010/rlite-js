var rlite = require('../index');
var assert = require('assert');
var fs = require('fs');

describe('rlite-js-sync', function(){
    var client;
    beforeEach(function() {
        client = rlite.createClient(':memory:');
    });

    it('should return empty when getting an unexisting key', function() {
        assert(client.commandSync(['get', 'key']) === null);
    });

    it('should return OK on set', function() {
        assert(client.commandSync(['set', 'key', 'value']) === 'OK');
    });

    it('should return value on get', function() {
        client.commandSync(['set', 'key', 'value']);
        assert(client.commandSync(['get', 'key']) === 'value');
    });

    it('should return an integer on rpush', function() {
        assert(client.commandSync(['rpush', 'list', 'first', 'second', 'third']) === 3);
    });

    it('should return an array on lrange', function() {
        client.commandSync(['rpush', 'list', 'first', 'second', 'third']);
        var list = client.commandSync(['lrange', 'list', '0', '-1'])
        assert(list.length === 3);
        assert(list[0] === 'first');
        assert(list[1] === 'second');
        assert(list[2] === 'third');
    });

    it('should return an error when number of arguments is wrong', function() {
        assert(client.commandSync(['set', 'key']) instanceof Error);
    });

    describe('persistence', function() {
        var path = 'mydb.rld';
        var client;

        before(function() {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }
        });

        after(function() {
            fs.unlinkSync(path);
        });

        beforeEach(function() {
            client = rlite.createClient(path);
        });

        it('should set a key', function() {
            client.commandSync(['set', 'key', 'value']);
        });

        it('should get key set', function() {
            assert(client.commandSync(['get', 'key']) === 'value');
        });
    });
});
