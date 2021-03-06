(function() {
"use strict";

let t = db.slice1;
t.drop();

t.insert({_id: 1, a: [0, 1, 2, 3, 4, 5, -5, -4, -3, -2, -1], b: 1, c: 1});

// first three
// @tags: [
//   sbe_incompatible,
// ]
let out = t.findOne({}, {a: {$slice: 3}});
assert.eq(out.a, [0, 1, 2], '1');

// last three
out = t.findOne({}, {a: {$slice: -3}});
assert.eq(out.a, [-3, -2, -1], '2');

// skip 2, limit 3
out = t.findOne({}, {a: {$slice: [2, 3]}});
assert.eq(out.a, [2, 3, 4], '3');

// skip to fifth from last, limit 4
out = t.findOne({}, {a: {$slice: [-5, 4]}});
assert.eq(out.a, [-5, -4, -3, -2], '4');

// skip to fifth from last, limit 10
out = t.findOne({}, {a: {$slice: [-5, 10]}});
assert.eq(out.a, [-5, -4, -3, -2, -1], '5');

// interaction with other fields

out = t.findOne({}, {a: {$slice: 3}});
assert.eq(out.a, [0, 1, 2], 'A 1');
assert.eq(out.b, 1, 'A 2');
assert.eq(out.c, 1, 'A 3');

out = t.findOne({}, {a: {$slice: 3}, b: true});
assert.eq(out.a, [0, 1, 2], 'B 1');
assert.eq(out.b, 1, 'B 2');
assert.eq(out.c, undefined);

out = t.findOne({}, {a: {$slice: 3}, b: false});
assert.eq(out.a, [0, 1, 2]);
assert.eq(out.b, undefined);
assert.eq(out.c, 1);

t.drop();
t.insert({
    comments: [{id: 0, text: 'a'}, {id: 1, text: 'b'}, {id: 2, text: 'c'}, {id: 3, text: 'd'}],
    title: 'foo'
});

// $slice in an inclusion projection.
out = t.findOne({}, {comments: {$slice: 2}, irrelevantField: 1});
assert.eq(out.comments, [{id: 0, text: 'a'}, {id: 1, text: 'b'}]);
assert.eq(out.title, undefined);

// Check that on its own, $slice defaults to an exclusion projection.
out = t.findOne({}, {comments: {$slice: 2}});
assert.eq(out.comments, [{id: 0, text: 'a'}, {id: 1, text: 'b'}]);
assert.eq(out.title, 'foo');

// $slice in an exclusion projection (with explicit exclusions).
out = t.findOne({}, {comments: {$slice: 2}, title: 0});
assert.eq(out.comments, [{id: 0, text: 'a'}, {id: 1, text: 'b'}]);
assert.eq(out.title, undefined);

// nested arrays
t.drop();
t.insert({_id: 1, a: [[1, 1, 1], [2, 2, 2], [3, 3, 3]], b: 1, c: 1});

out = t.findOne({}, {a: {$slice: 1}});
assert.eq(out.a, [[1, 1, 1]], 'n 1');

out = t.findOne({}, {a: {$slice: -1}});
assert.eq(out.a, [[3, 3, 3]], 'n 2');

out = t.findOne({}, {a: {$slice: [0, 2]}});
assert.eq(out.a, [[1, 1, 1], [2, 2, 2]], 'n 2');
})();
