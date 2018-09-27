

new Promise(/* executor */ function(resolve, reject) {});

var promise1 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('foo');
  }, 300)
});

promise1.then(function(value) {
  console.log(value);
  // expected output: "foo"
});


function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  })
}

let myFirstPromise = new Promise((resolve, reject) => {
  // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed
  // In this example, we use setTimeout(...) to simulate async code.
  // In reality, you will probably be using something like XHR or an HTML5 API.
  setTimeout(function() {
    resolve("Success!"); // Yay! Everything went well
  }, 250);
})

myFirstPromise.then((successMessage) => {
  // successMessage is whatever we passed in the resolve(...) function above.
  // It doesn't have to be a string, but if it is only a succeed message, it probably will be
  console.log("Yay! " + successMessage)
})

var promiseCount = 0;

function testPromise() {
  let thisPromiseCount = ++promiseCount;

  let log = document.getElementById('log');
  log.insertAdjacentHTML('beforeend', thisPromiseCount + 
    ') started (<small>Sync code started</small>)<br/>');

  // We make a new promise: we promise a numeric count of this promise, starting from 1 (after waiting 3s)
  let p1 = new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    (resolve, reject) => {
      log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Promise started (<small>Async code started</small>)<br/>');
      // This is only an example to create asynchronism
      window.setTimeout(
        function() { 
          // We fulfill the promise!
          resolve(thisPromiseCount);
        }, Math.random() * 2000 + 1000
      )
    }
  );

  // We define what to do when the promise is resolved with the then() call,
  // and what to do when the promise is rejected with the catch() call
  p1.then(
    // Log th fulfillment value
    function(val) {
      log.insertAdjacentHTML('beforesend', val + 
        ') Promise fulfilled (<small>Async code terminated</small><br/>');
    }
  )
  .catch(
    // Log the rejection reason
    (reason) => {
      console.log('Handle rejected promise('+reason+') here.');
    }
  );

  log.insertAdjacentHTML('beforeend', thisPromiseCount +
    ') Promise made (<small>Sync code terminated</small>)<br/>');
}

// https://medium.com/@ramsunvtech/promises-of-promise-part-1-53f769245a5
