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

let result = [
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
  {
    firstname: 'asdasd',
    lastname: 'qweqwe',
    middlename: 'zxczxc'
  },
];
result = [...result, ...result];
result = [...result, ...result];
result = [...result, ...result];

function test1() {
  const newObj = [];
  for (const index in result) {
    res = result[index];
    newObj[index]  = {};
    newObj[index].firstname = res.firstname;
    newObj[index].lastname = res.lastname;
    newObj[index].middlename = res.middlename;
  }
  const res1 = JSON.stringify(newObj);
  return res1;
}

function test2() {
  let res1 = '';
  for (const index in result) {
    res = result[index];
    res1 += '{';
    res1 += '"firstname":';
    res1 += '"' + res.firstname + '"';
    res1 += '"lastname":';
    res1 += '"' + res.lastname + '"';
    res1 += '"middlename":';
    res1 += '"' + res.middlename + '"';
    res1 += '}';
    if (index !== result.length) res1 += ',';
  }
  return '[' + res1 + ']';
}

function test3() {
  let res1 = [];
  for (const index in result) {
    res = result[index];
    res1.push('{');
    res1.push('"firstname":');
    res1.push('"' + res.firstname + '"');
    res1.push('"lastname":');
    res1.push('"' + res.lastname + '"');
    res1.push('"middlename":');
    res1.push('"' + res.middlename + '"');
    res1.push('}');
    if (index !== result.length) res1.push(',');
  }
  return '[' + res1.join('') + ']';
}

mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);