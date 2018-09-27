// tonic ^6.0.0
const generatorFunction = function* () {};
const iterator = generatorFunction();

console.log(iterator[Symbol.iterator]);

// generatorFunction variable is assigned a generator function, denoted with function* 

//  Calling a generator function returns an iterator object

const generatorFunction = function* () {
  // this does not get executed.
  console.log('a');
}

console.log(1);
const iterator = generatorFunction();
console.log(2);

// 1
// 2

// next() method is used to advance the execution of the generator body
const generatorFunction = function* () {
  console.log('a');
};

console.log(1);
const iterator = generatorFunction();
console.log(2);
iterator.next();
console.log(3);

// 1
// 2
// a
// 3

// next() method returns an object that indicates the progress of the iteration
const generatorFunction = function* () {};
const iterator = generatorFunction();

console.log(iterator.next());

// Object {value: undefined, done: true}

// done property indicates that the generator body has run to completion 

// The generator function is expected to utilize the yield keyword. 
// yield suspends execution of a generator and returns control to the iterator.
const generatorFunction = function* () {
  yield;
};
const iterator = generatorFunction();

console.log(iterator.next());
console.log(iterator.next());

// Object {value: undefined, done: false}
// Object {value: undefined, done: true}

// when suspended, the generator does not block the event queue:
const generatorFunction = function* () {
  var i = 0;
  while(true) {
    yield i++
  }
};

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
 
// Object {value: 0, done: false}
// Object {value: 1, done: false}
// Object {value: 2, done: false}
// Object {value: 3, done: false}
// Object {value: 4, done: false}
// Object {value: 5, done: false}

// yield keyword can pass a value back to the iterator
const generatorFunction = function* () {
  yield 'foo';
};

const iterator = generatorFunction();

console.log(iterator.next());
console.log(iterator.next());

// Object {value: "foo", done: false}
// Object {value: undefined, done: true}

// when the generator is advanced to completion, the return value is returned
const generatorFunction = function* () {
  yield 'foo';
  return 'bar';
}

const iterator = generatorFunction();

console.log(iterator.next());
console.log(iterator.next());

// Object {value: "foo", done: false}
// Object {value: "bar", done: true}

// yield keyword can receive a value back from the iterator
const generatorFunction = function* () {
  console.log(yield);
};

const iterator = generatorFunction();

iterator.next('foo');
iterator.next('bar');

// bar

// there is no yield expression to receive the first value "foo". The value is tossed away

// Iterating using the for...of statement
// the iterator object returned from the generator is compliant with the 'iterable' protocol.
// Therefore, you can use the for...of statement to loop through the generator
let index;

const generatorFunction = function* () {
  yield 1;
  yield 2;
  yield 3;
  return 4;
};

const iterator = generatorFunction();

for (index of iterator) {
  console.log(index);
}

// 1
// 2
// 3

// the iteration will continue as long as done property is false
// the for..of loop cannot be used in cases where you need to pass in values to the generator steps
// the for..of loop will throw away the return value

// Delegating yield
// the yield* operator delegates to another generator

let index;

const foo = function* () {
  yield 'foo';
  yield * bar();
}

const bar = function* () {
  yield 'bar';
  yield * baz();
}
const baz = function* () {
  yield 'baz';
}

for (index of foo()) {
  console.log(index);
}

// foo
// bar
// baz

// Throw
// in addition to advancing the generator instance using next(), you can throw().
// Whatever is thrown will propagate back up into the code of the generator,
// i.e. it can be handled either within or outside the generator instance
const generatorFunction = function* () {
  while(true) {
    try {
      yield
    } catch(e) {
      if (e != 'a') {
        throw e;
      }
      console.log('Generator caught', e);
    }
  }
}

const iterator = generatorFunction();

iterator.next();

try {
  iterator.throw('a');
  iterator.throw('b');
} catch {
  console.log('Uncaught', e);
}

// Generator caught a
// Uncaught b

// ASYNC operations
const foo = (name, callback) => {
  setTimeout(() => {
    callback(name);
  }, 100)
};

const curry = (method, ...args) => {
  return (callback) => {
    args.push(callback);

    return method.apply({}, args);
  }
}

const controller = (generator) => {
  const iterator = generator();

  const advancer = (response) => {
    var state;
    state = iterator.next(response)
    if(!state.done) {
      state.value(advancer);
    }
  };

  advancer();
}

controller(function* () {
  const a = yield curry(foo, 'a');
  const b = yield curry(foo, 'b');
  const c = yield curry(foo, 'c');

  console.log(a, b, c);
})

// a
// b
// c

// The asterisk after 'function' means that objectEntries is a generator
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    // 'yield' returns a value and then pauses
    // the generator. Later, execution continues
    // where it was previously paused.
    yield [propKey, obj[propKey]]
  }
}

let jane = { first: 'Jane', last: 'Doe' };
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

// generators are functions that can be paused and resumed
function* genFunc() {
  console.log('First');
  yield;
  console.log('Second');
}
// calling genFunc does not execute it. Instead, it returns a 
// so-called generator object that lets us control genFunction's execution
let genObj = genFunc();
genObj.next()
// First
// {value: undefined, done: true}
genObj.next();
// Second
// { value: undefined, done: true }

// Generators as iterators (data production)
interface Iterable {
  [Symbol.iterator](): Iterator;
}

interface Iterator {
  next(): IteratorResult;
  return?(value? : any) : IteratorResult
}

interface IteratorResult {
  value: any;
  done: boolean;
}

function* genFunc() {
  yield 'a';
  yield 'b';
}

let genObj = genFunc();
genObj.next();
// { value: 'a', done: false }
genObj.next();
// { value: 'b', done: false }
genObj.next();
// { value: undefined, done: true }

for (let x of genFunc()) {
  console.log(x);
}

// a
// b

let arr = [...genFunc()]; // ['a', 'b']

let [x, y] = genFunc();
x 
// 'a'
y 
// 'b'

function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'result';
}

let genObjWithReturn = genFuncWithReturn();
genObjWithReturn.next()
// { value: 'a', done: false }
 genObjWithReturn.next()
// { value: 'b', done: false }
genObjWithReturn.next()
// { value: 'result', done: true }

// yield*
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  foo(); // does nothing
  yield 'y';
}

// calling foo() returns an object but does not actully execute foo()

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

let arr = [...bar()];
// ['x', 'a', 'b', 'y']

// the operand of yield* does not have to be a generator object, it can be
// any iterable
function* bla() {
  yield 'sequence';
  yield* ['of', 'yielded'];
  yield 'values';
}

let arr = [...bla()]
// ['sequence', 'of', 'yielded', 'values']

function* genFuncWithReturn(genObj) {
  yield 'a';
  yield 'b';
  return 'The Result';
}

function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// [ 'a', 'b' ]

class BinaryTree {
  constructor(value, left=null, right=null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  // Prefix Iteration
  * [Symbol.iterator]() {
    yield this.value;
    if (this.left) {
      yield* this.left
    }  
    if (this.right) {
      yield* this.right
    }
  }
}

let tree = new BinaryTree('a',
    new BinaryTree('b',
        new BinaryTree('c'),
        new BinaryTree('d')),
    new BinaryTree('e'));

for (let x of tree) {
    console.log(x);
}
// Output:
// a
// b
// c
// d
// e

// Generators as observers (data consumption)
/*
interface Observer {
  next(value? : any) : void;
  return(value? : any) : void;
  throw(error) : void;
}
*/

// next() -> sends normal input
// return() -> terminates the generator
// throw() -> signals an error

function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();

genObj.next();
// Started
//  { value: undefined, done: false }

genObj.next('a');
// 1. a
// { value: undefined, done: false }

genObj.next('b');
// 2. b
// { value: 'result', done: true }

// The first next()'s only purpose is to start the observer
function* g() { yield };
g().next('hello') // TypeError: attempt to send 'hello' to newborn generator

function coroutine(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  }
}

const wrapped = coroutine(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});
const normal = function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
};
// The wrapped generator is immediately ready for input
wrapped().next('Hello!')
// First input: Hello!

let genObj = normal();
genObj.next()
// { value: undefined, done: false }
genObj.next('Hello!');
// First input Hello!
// { value: 'DONE', done: true }

// Example: processing async pushed data

// First Chain Member:
// a normal function that has a parameter target, which 
// is the generator object of the next element in the chain 
// of generators. The function makes an asynchronous request and pushes
// the results to the target via target.next()

// Intermediate Chain Member:
// generator that has a parameter target. They recieve data
// via yield and send data via target.next()

// Last Chain member: 
// a generator that has no parameter target and only recieves data

function chain(...generatorFuncs) {
  if (generatorFuncs.length < 1) {
    throw new Error('Need at least 1 argument');
  }
  let generatorObject = generatorFuncs[generatorFuncs.length-1]();

  generatorObject.next(); // generator is now ready for input
  for (let i=generatorFuncs.length-2; i >= 0; i--) {
    let generatorFunction = generatorFuncs[i];
    // link current generator to successor
    generatorObject = generatorFunction(generatorObject);
    // start the generator
    generatorObject.next();
  }
  return generatorObject;
}

// readFile() is the non-generator function that starts everything
import { createReadStream } from 'fs';
/**
 * Create an asynchronous ReadStream for the file whose name is
 * 'fileName' and feed it to the generator object 'target' 
 * 
 * @see ReadStream https://nodejs.org/api/fs.html#fs_class_fs_readstream
 */

function readFile(fileName, target) {
  let readStream = createReadStream(fileName, 
    { encoding: 'utf8', bufferSize: 1024 });
  readStream.on('data', buffer => {
    let str = buffer.toString('utf8');
    target.next(str);
  });
  readStream.on('end', () => {
    // Signal end of ouput sequence
    target.return();
  })
}

// The chain of generators starts with splitLines
/**
 * Turns a sequence of text chunks into a sequence of lines
 * (where lines are separated by newlines)
 */
function* splitLines(target) {
  let previous = '';
  try { 
    while(true) {
      previous += yield;
      let eolIndex;
      while ((eolIndex = previous.indexOf('\n')) >= 0) {
        let line = previous.slice(0, eolIndext);
        target.next(line);
        previous = previous.slice(eolIndex + 1);
      }
    }
  } finally {
    // Handle the end of the input sequence
    // (signalled via 'return()')
    if (previous.length > 0) {
      target.next(previous);
    }
    // Signal end of output sequence
    target.return()
  }
}

// The next generator is numberLines
/**
 * Prefixes numbers to a sequence of lines
 */
function* numberLines(target) {
  try {
    for (let lineNo = 0; ; lineNo++) {
      let line = yield;
      target.next(`${lineNo}: ${line}`);
    }
  } finally {
    // signal the end of the input sequence
    target.return();
  }
}

// the last generator is printLines
/**
 * Recieves a sequence of lines (without newlines)
 * and logs them (adding newlines).
 */
function* printLines() {
  while (true) {
    let line = yield;
    console.log(line);
  }
}

