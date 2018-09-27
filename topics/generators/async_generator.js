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

let fileName = process.argv[2];

if(fileName) readFile(fileName, chain(splitLines, numberLines, printLines))