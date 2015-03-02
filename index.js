var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

// typedef
var rlite = ref.types.void;
var rlitePtr = ref.refType(rlite);
var rlitePtrPtr = ref.refType(rlitePtr);
var stringPtr = ref.refType(ref.types.CString);
var reply = Struct();
var replyPtr = ref.refType(reply);
reply.defineProperty('type', 'int');
reply.defineProperty('integer', 'long long');
reply.defineProperty('len', 'int');
reply.defineProperty('str', 'string');
reply.defineProperty('elements', 'size_t');
reply.defineProperty('element', replyPtr);

var size_tPtr = ref.refType(ref.types.size_t)

var libsrlite = ffi.Library('./libhirlite', {
  'rliteConnect': [ rlitePtr, [ 'string', 'int' ] ],
  'rliteFree': [ 'void', [ rlitePtr ] ],
  'rliteCommandArgv': [ replyPtr, [ rlitePtr, 'int', stringPtr, size_tPtr ] ],
  'rliteFreeReplyObject': [ 'void', [ replyPtr ] ],
});

var RLITE_REPLY_STRING = 1;
var RLITE_REPLY_ARRAY = 2;
var RLITE_REPLY_INTEGER = 3;
var RLITE_REPLY_NIL = 4;
var RLITE_REPLY_STATUS = 5;
var RLITE_REPLY_ERROR = 6;

var reply_to_js = function(reply) {
    if (reply.type == RLITE_REPLY_STRING || reply.type == RLITE_REPLY_STATUS) {
        // TODO: binary safe
        return reply.str;
    }
    if (reply.type == RLITE_REPLY_NIL) {
        return null;
    }
    if (reply.type == RLITE_REPLY_INTEGER) {
        return reply.integer;
    }
    if (reply.type == RLITE_REPLY_ERROR) {
        return new Error(reply.str);
    }
    if (reply.type == RLITE_REPLY_ARRAY) {
        var arr = [];
        for (var i = 0; i < reply.elements; i++) {
            // var ptr = ref.readPointer(reply.element, ref.sizeof.pointer * i);
            // arr.push(reply_to_js(ptr.deref()));
            var obj = ref.get(reply.element, ref.sizeof.pointer * i, replyPtr);
            arr.push(reply_to_js(obj.deref()));
        }
        return arr;
    }
    throw new Error('Unexpected type ' + reply.type);
};

var command = function(db, args) {
    var argv = new Buffer(ref.sizeof.pointer * args.length);
    var argvlen = new Buffer(ref.sizeof.uint64 * args.length);

    for (var i = 0; i < args.length; i++) {
        var value = new Buffer(ref.sizeof.char * (args[i].length + 1));
        ref.writeCString(value, 0, args[i]);
        ref.writePointer(argv, ref.sizeof.pointer * i, value);

        ref.writeUInt64(argvlen, ref.sizeof.uint64 * i, args[i].length);
    }

    var replyObj = libsrlite.rliteCommandArgv(db, args.length, argv, argvlen);
    var data = replyObj.deref();
    var obj = reply_to_js(data);
    libsrlite.rliteFreeReplyObject(replyObj);
    return obj;
};

exports.createClient = function(arg0, arg1){
    var db = libsrlite.rliteConnect(arg0, arg1 || 0);
    return {
        command: function(args) {
            return command(db, args);
        }
    };
}
