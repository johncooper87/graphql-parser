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

const testCount = 10000;

const arr = [1, 2, 'aaa', 'b'];

class A1 {
  prop1;
  prop2;
  prop3;

  constructor(prop1, prop2, prop3) {
    this.prop1 = prop1;
    this.prop2 = prop2;
    this.prop3 = prop2;
  }
}

class A2 {
  prop1;
  prop2;
  prop3;

  constructor(ref) {
    this.prop1 = ref[0];
    this.prop2 = ref[1];
    this.prop3 = ref[2];
  }
}

ref = ['asdasdsad', 'asdaasdasds', 3];

function test1() {
  //const res = new A1(ref[0], ref[1], ref[2]);
  const res = new A2(ref);
  return res;
}

function test2() {
  //const res = new A1(ref);
  const prop1 = ref[0];
  const prop2 = ref[1];
  const prop3 = ref[2];
  const res = new A1(prop1, prop2, prop3);
  //const res = new A1(ref[0], ref[1], ref[2]);
  return res;
}

mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
