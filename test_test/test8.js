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

const testCount = 1000000;

let source = "adasdasdsasad asdasdasd asdasd 123123 23123123";
for (let i = 0; i < 15; i++) source += source;
const src = {
  source
};

const arr1 = [];
const arr2 = []

function test1() {
  const res = {}
  res.source = source;
  arr1.push(res);
  return res;
}

function test2() {
  const res = {}
  res.source = src;
  arr2.push(res);
  return res;
}

mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
