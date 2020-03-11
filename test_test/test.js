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

// function mp(targetFn, count = 1000, label) {
//   let time = [0, 0];
//   for (let counter = 0; counter < count; counter++) {
//     const start = process.hrtime();
//     targetFn();
//     time[1] += process.hrtime(start)[1];
//   }
//   let s = time[0].toString();
//   s = ('0000' + s).substring(s.length, s.length + 4);

//   let ms = (time[1] / 1000000).toString();
//   ms = ms.split('.');
//   ms[0] = ('000' + ms[0]).substring(ms[0].length, ms[0].length + 3);
//   ms[1] = (ms[1] + '000000').substring(0, 6);
//   ms = ms.join('.');

//   let _label = label || targetFn.name;
//   _label = ('                    ' + _label).substring(_label.length, _label.length + 20);

//   console.log(_label + ':', s, 's, ', ms, 'ms');
// }

const testCount = 100;

let query = `
  query operation($limit: Int! $offset: String) {
    users: allUsers(limit: $limit offset: $offset arg1: 1 arg2: 2.3 argg22: 2.3e5 arg3: "asd qwerty
    zasdsad asdasdas asdasd asdsad\\"asdxcv"): {
      id
      email
      firstname: name
      lastname: surname
    }
    totalUsers
  }
`;

for (let i = 0; i < 3; i++) {
  query = query + query;
}

const pattern1 = [

  '\\"(?:[^"\\\\]|\\\\.)*\\"',
  '?:\\r?\\n',
  '?:-?(0|[1-9]\\d*)(\\.\\d+)?([eE][-+]?\\d+)?',
  '\\w+',
  '[!@$=\\(\\)\\{\\}\\[\\]]|\\.{3}',
  '[^\\s,]'
  
].map(exp => `(${exp})`).join('|');

const pattern3 = [

  '\\"(?:[^"\\\\]|\\\\.)*\\"',
  '?:\\r?\\n',
  '?:-?(0|[1-9]\\d*)(\\.\\d+)?([eE][-+]?\\d+)?',
  '\\w+',
  '[!@$=\\(\\)\\{\\}\\[\\]]|\\.{3}',
  '[^\\s,]'
  // '\\"(?:[^"\\\\]|\\\\.)*\\"',
  // '?:\\r?\\n',
  // '?:(-?(?:0|[1-9]\\d*))(\\.\\d+)?([eE][-+]?\\d+)?',
  // '\\w+',
  // '[!@$=\\(\\)\\{\\}\\[\\]]|\\.{3}',
  // '[^\\s,]'
  
].map(exp => `(${exp})`).join('|');

const pattern2 = [

  '\\"(?:[^"\\\\]|\\\\.)*\\"',
  '\\r?\\n',
  '-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][-+]?\\d+)?',
  '\\w+',
  '[^\\s,]'
  
].map(exp => `(?:${exp})`).join('|');

class Token {
  value;
  kind;
  start;
  source;

  constructor(value, kind, start, source) {
    this.value = value;
    this.kind = kind;
    this.start = start;
    this.source = source;
  }
}

class Lexer1 {
  source;
  lastToken;
  scan;

  constructor(source) {
    this.source = source;
    const scanner = new RegExp(pattern1, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  nextToken() {
    const res = this.scan();
    if (res === null) return null;

    const { 0: lexem, 1: stringLiteral, 2: integerPart, 3: fractionalPart, 4: exponentialNotation, 5: name, 6: punctuator, 7: unexpected, index } = res;
    //const [ lexem, stringLiteral, integerPart, fractionalPart, exponentialNotation, name, punctuator ] = res;

    if (lexem === '\\n' || lexem === '\\r\\n') return this.nextToken();

    let kind;

    if (name !== undefined)  3;
    else if (punctuator !== undefined) kind = 4;
    else if (integerPart !== undefined) {
      kind = fractionalPart === undefined && exponentialNotation == undefined ? 1 : 2;
    }
    else if (stringLiteral !== undefined) kind = 0;
    
    this.lastToken = new Token(lexem, kind, index, this);
    return this.lastToken;
  }
}

class Lexer3 {
  source;
  lastToken;
  scan;

  constructor(source) {
    this.source = source;
    const scanner = new RegExp(pattern3, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  nextToken() {
    const res = this.scan();
    if (res === null) return null;

    const { 0: lexem, 1: stringLiteral, 2: integerPart, 3: fractionalPart, 4: eNotation, 5: name, 6: punctuator, index } = res;
    //const [ lexem, stringLiteral, integerPart, fractionalPart, exponentialNotation, name, punctuator ] = res;

    if (lexem === '\\n' || lexem === '\\r\\n') return this.nextToken();

    let kind;

    // if (name !== undefined)  3;
    // else if (punctuator !== undefined) kind = 4;
    // else if (integerPart !== undefined) {
    //   kind = fractionalPart === undefined && exponentialNotation == undefined ? 1 : 2;
    // }
    // else if (stringLiteral !== undefined) kind = 0;
    // kind =
    //   name !== undefined ? 3
    //   : punctuator !== undefined ? 4
    //   // If the lexeme has the integer part then it is at least a numeric literal
    //   : integerPart !== undefined ? (
    //     // If the lexeme does not have the fractional part or exponential notation
    //     // then it is an integer literal, otherwise it is a floating-point literal
    //     fractionalPart === undefined && eNotation === undefined
    //     ? 1 : 2
    //   ) : stringLiteral !== undefined ? 0
    //   : undefined;
    kind =
      name && 3
      || (punctuator && 4)
      // If the lexeme has the integer part then it is at least a numeric literal
      || (integerPart && (
        // If the lexeme does not have the fractional part or exponential notation
        // then it is an integer literal, otherwise it is a floating-point literal
        fractionalPart && eNotation
        && 1 || 2
      )) || (stringLiteral && 0)
      || undefined;
    
    this.lastToken = new Token(lexem, kind, res.index);
    return this.lastToken;
  }
}

class Lexer2 {
  source;
  lastToken;
  scan;

  constructor(source) {
    this.source = source;
    const scanner = new RegExp(pattern2, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  nextToken() {
    const res = this.scan();
    if (res === null) return null;

    const { 0: lexem, index } = res;
    if (lexem === '\\n' || lexem === '\\r\\n') return this.nextToken();

    let  kind;

    const code = lexem.charCodeAt(0);
    if (code === 34) kind = 0;
    else if ((code >= 48 && code <= 57) || code === 45) {
      kind = /[.eE]/.test(lexem) ? 2 : 1;
    }
    else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95)  kind = 3;
    if (code === 33 || code === 36 || code === 40 || code === 41 || code === 61 || code === 91 || code === 93 || code === 123 || code === 125 || lexem === '...') kind = 4;

    this.lastToken = new Token(lexem, kind, index , this.source);
    return this.lastToken;
  }
}

function test1() {
  const lexer = new Lexer1(query);
  let token = lexer.nextToken();
  while (token) {
    token = lexer.nextToken();
  }
  return token;
}

function test2() {
  const lexer = new Lexer2(query);
  let token = lexer.nextToken();
  while (token) {
    token = lexer.nextToken();
  }
  return token;
}

mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
