// https://developers.google.com/web/fundamentals/primers/promises

function get(url) {
  // Return a new promise
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if(req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    }

    // make the request
    req.send();
  })
}

get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error)
});

// Chaining
var promise = new Promise(function(resolve, reject) {
  resolve(1);
})

promise.then(function(val) {
  console.log(val);
  return val + 2;
}).then(function(val) {
  console.log(val);
})

/*
  When you return something from a then() callback, it's a bit magic. If you return a value,
  the next then() is called with that value. However, if you return something promise-like, 
  the next then() waits on it and is only called when that promise settles (succeeds/fails).
*/

function getJSON(url) {
  return get(url).then(JSON.parse);
}

var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1)
}).then(function(chapter) {
  console.log(chapter)
})

// Error recovery
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})