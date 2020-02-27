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

let query = `
  query operation($limit: Int! $offset: String) {
    users: allUsers(limit: $limit offset: $offset arg1: 1 arg2: 2.3 argg22: 2.3e5 arg3: "asd qwerty
    zxcv"): {
      id
      email
      firstname: name
      lastname: surname
    }
    totalUsers
  }
`;

for (let i = 0; i < 7; i++) {
  query = query + query;
}

const matchToken1 = [

  /"(?:.|\s)*?"/,                         // string literal
  /(?:-)?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/, // number literal
  /\w+/,                                  // name
  /\.{3}/, /[^\s,]/                       // punctuator
  
].map(exp => `(${exp.source})`).join('|');

const matchToken2 = [

  /"(?:.|\s)*?"/,
  /(?:-)?\d+(?:(?:\.\d+[eE][-+]?\d+)|(?:\.\d+)|(?:[eE][-+]?\d+))/,
  /(?:-)?(?:0|[1-9]\d*)/,
  /\w+/,
  /\.{3}/, /[^\s,]/
  
].map(exp => `(${exp.source})`).join('|');

// const _matchTokens = new RegExp(matchToken2, 'g');
// const res = [...query.matchAll(_matchTokens)];
// console.log(res);

function test1() {
  const _matchTokens = new RegExp(matchToken1, 'g');
  let token = _matchTokens.exec(query);
  while (token) {
    token = _matchTokens.exec(query);
  }
}

function test2() {
  const _matchTokens = new RegExp(matchToken1, 'g');
  let token = _matchTokens.exec(query);
  while (token) {
    token = _matchTokens.exec(query);
  }
}

function test3() {
  const _matchTokens = new RegExp(matchToken2, 'g');
  let token = _matchTokens.exec(query);
  while (token) {
    token = _matchTokens.exec(query);
  }
}

function test4() {
  const _matchTokens = new RegExp(matchToken2, 'g');
  let token = _matchTokens.exec(query);
  while (token) {
    token = _matchTokens.exec(query);
  }
}

mp(test1, testCount);
mp(test2, testCount);
mp(test3, testCount);
mp(test4, testCount);