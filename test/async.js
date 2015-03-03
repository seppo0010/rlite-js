var rlite = require('../index');
var assert = require('assert');
var fs = require('fs');

describe('rlite-js-async', function(){
    var client;
    beforeEach(function() {
        client = rlite.createClient(':memory:');
    });

    it('should return empty when getting an unexisting key', function(done) {
        client.command(['get', 'key'], function(err, ret) {
            assert(err === null && ret === null);
            done();
        })
    });

    it('should return OK on set', function(done) {
        client.command(['set', 'key', 'value'], function(err, ret) {
            assert(err === null && ret === 'OK');
            done();
        });
    });

    it('should return value on get', function(done) {
        client.command(['set', 'key', 'value'], function(err, ret) {
            assert(err === null);
            client.command(['get', 'key'], function(err, ret) {
                assert(ret === 'value');
                done();
            })
        });
    });

    it('should return an integer on rpush', function(done) {
        client.command(['rpush', 'list', 'first', 'second', 'third'], function(err, ret) {
            assert(err === null && ret === 3);
            done();
        });
    });

    it('should return an array on lrange', function(done) {
        client.command(['rpush', 'list', 'first', 'second', 'third'], function(err, ret) {
            assert(err === null);
            client.command(['lrange', 'list', '0', '-1'], function(err, ret) {
                assert(err === null);
                assert(ret.length === 3);
                assert(ret[0] === 'first');
                assert(ret[1] === 'second');
                assert(ret[2] === 'third');
                done();
            })
        });
    });

    it('should return an error when number of arguments is wrong', function(done) {
        client.command(['set', 'key'], function(err, ret) {
            assert(err);
            assert(err instanceof Error);
            done();
        });
    });

    describe('persistence', function(done) {
        var path = 'mydb.rld';
        var client;

        before(function() {
            if (fs.exists(path)) {
                fs.unlink(path);
            }
        });

        after(function() {
            fs.unlink(path);
        });

        beforeEach(function() {
            client = rlite.createClient(path);
        });

        it('should set a key', function(done) {
            client.command(['set', 'key', 'value'], function(err, ret) {
                assert(err === null);
                done();
            });
        });

        it('should get key set', function(done) {
            client.command(['get', 'key'], function(err, ret) {
                assert(err === null && ret === 'value');
                done();
            });
        });
    });
})
