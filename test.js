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

const query = `
  query operation($limit: Int! $offset: String) {
    users: allUsers(limit: $limit offset: $offset arg1: 1 arg2: 2.3 arg3: "asd qwerty
    zxcv"): {
      id
      email
      firstname: name
      lastname: surname
    }
    totalUsers
  }
`;

// const matchToken1 = new RegExp(

//   [
//     /"(?:.|\s)*?"/,
//     /\d+\.\d+/,
//     /\d+/,
//     /\.{3}/,
//     /true|false/,
//     /\$\w+/,
//     /\w+(?:\!)?/,
//     /[^\s,]/
//   ].map(value => {
//     const str = value.toString();
//     return `(${str.substr(1, str.length - 2)})`;
//   }).join('|'),

// 'g');

// const matchToken2 = new RegExp(

//   [
//     /"(?:.|\s)*?"/,
//     /\d+\.\d+/,
//     /\d+/,
//     /\.{3}/,
//     /true|false/,
//     /\$\w+/,
//     /\w+(?:\!)?/,
//     /[^\s,]/
//   ].map(value => {
//     const str = value.toString();
//     return `(${str.substr(1, str.length - 2)})`;
//   }).join('|'),

// 'g');

function test1() {
  const matchToken = new RegExp(

    [
      /"(?:.|\s)*?"/,
      /\d+\.\d+/,
      /\d+/,
      /\.{3}/,
      /true|false/,
      /\$\w+/,
      /\w+(?:\!)?/,
      /[^\s,]/
    ].map(value => {
      const str = value.toString();
      return `(${str.substr(1, str.length - 2)})`;
    }).join('|'),
  
  'g');
  const res = [...query.matchAll(matchToken)];
  return res;
}

function test2() {
  const matchToken = new RegExp(

    [
      /"(?:.|\s)*?"/,
      /\d+\.\d+/,
      /\d+/,
      /\.{3}/,
      /true|false/,
      /\$\w+/,
      /\w+\!/,
      /\w+/,
      /[^\s,]/
    ].map(value => {
      const str = value.toString();
      return `(${str.substr(1, str.length - 2)})`;
    }).join('|'),
  
  'g');
  const res = [...query.matchAll(matchToken)];
  return res;
}

function test3() {
  const matchToken = new RegExp(

    [
      /"(?:.|\s)*?"/,
      /\d+\.\d+/,
      /\d+/,
      /\.{3}/,
      /true|false/,
      /\$\w+/,
      /\w+\!/,
      /\w+/,
      /\(/,
      /\)/,
      /\{/,
      /\}/,
      /\[/,
      /\]/,
      /\:/,
      /[^\s,]/
    ].map(value => {
      const str = value.toString();
      return `(?:${str.substr(1, str.length - 2)})`;
    }).join('|'),
  
  'g');
  const res = [...query.matchAll(matchToken)];
  return res;
}

mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);

