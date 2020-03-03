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
const arr = ["totalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUsers", undefined, undefined, undefined, "totalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUserstotalUsers", undefined];

function test1() {
  const res = arr.findIndex((value, index) => value !== undefined && index > 0 );
  return res;
}

function test2() {
  const res = arr.indexOf(arr[0], 1);
  return res;
}

function test3() {
  const res = arr.findIndex(matchTokenKind);
  return res;
}

function test4() {
  const res = arr.indexOf(arr[0], 1);
  return res;
}

mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);
mp(test4, testCount);
