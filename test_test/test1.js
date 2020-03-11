function mp(targetFn, count = 1000, label) {
  const start = process.hrtime();
  for (let counter = 0; counter < count; counter++) {
    targetFn();
  }
  const time = process.hrtime(start);
  let s = time[0].toString();
  s = ('0000' + s).substring(s.length, s.length + 4);

  let ms = (time[1] / 1000000).toString();
  ms = ms.split('.');
  ms[0] = ('000' + ms[0]).substring(ms[0].length, ms[0].length + 3);
  ms[1] = (ms[1] + '000000').substring(0, 6);
  ms = ms.join('.');

  let _label = label || targetFn.name;
  _label = ('                    ' + _label).substring(_label.length, _label.length + 20);

  console.log(_label + ':', s, 's, ', ms, 'ms');
}

const testCount = 1000;

//const matchTokenKind = (value, index) => index > 0 && value !== undefined;
function matchTokenKind(value, index) {
  return value !== undefined && index;
  //return value != null;
}
//const arr = ["totalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUsers", undefined, undefined, undefined, "totalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUsers", undefined];
const arr = ["asdasd", undefined, undefined, "asd", undefined, undefined];

// function test1() {
//   const res = arr.findIndex((value, index) => value !== undefined && index > 0 );
//   return res;
// }

// function test2() {
//   const res = arr.indexOf(arr[0], 1);
//   return res;
// }

// function test3() {
//   const res = arr[1] || arr[3] || arr[2] || arr[4] || arr[5];
//   return res;
// }

// function test4() {
//   const res = arr.findIndex(matchTokenKind);
//   return res;
// }

function test1() {
  const res = arr.indexOf(arr[0], 1);
  return res;
}

//function test6([ is1, is2, is3, is4, is5 ]) {
function test2() {
  //const res = is1 || is3 || is2 || is4 || is5;
  let res;
  if (arr[1] !== undefined) {
    res = 1;
  } else if (arr[2] !== undefined) {
    res = 2;
  } else if (arr[3] !== undefined) {
    res = 3;
  } else if (arr[4] !== undefined) {
    res = 4;
  } else if (arr[5] !== undefined) {
    res = 5;
  }
  
  return res;
}

function test3() {
  //const res = is1 || is3 || is2 || is4 || is5;
  let res;
  for (let index; index < ) {
    res = 1;
  } else if (arr[2] !== undefined) {
    res = 2;
  } else if (arr[3] !== undefined) {
    res = 3;
  } else if (arr[4] !== undefined) {
    res = 4;
  } else if (arr[5] !== undefined) {
    res = 5;
  }
  
  return res;
}

mp(test1, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test2, testCount);