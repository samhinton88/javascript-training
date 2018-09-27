var promiseCall = function(waitSecond, returnData) {
  return function (resolve, reject) {
    setTimeout(resolve, waitSecond, returnData);
  }
}

var p1 = new Promise(promiseCall(1000, "one"));
var p2 = new Promise(promiseCall(2000, 'two'));
var p3 = new Promise(promiseCall(3000, 'three'));
var p4 = new Promise(promiseCall(4000, 'four'));
var p5 = new Promise((resolve, reject) => {
  reject('5th Promise Rejected');
});


Promise.all([p1, p2, p3, p4, p5]).then((value) => {
  console.log(value)
}, (reason) => {
  console.log(reason)
})