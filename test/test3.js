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


let source = `
asda
asdasd asdasdas asdasd 2334 fgdfg dfg
dfgfdg4543 dfgfdgrt dfgdfg43543
dfgdfgdfg 234

gddgfdg 45345             435345  fdgdf g            dfgdfg



dfgdfg  dfgfdg  

   
 
 
 4534 fgfdgdfg

`;

//for (let i = 0; i < 5; i++) source = source + source;

//const pattern = `\\w+`;

const pattern = [
  '\\"(?:[^"\\\\]|\\\\.)*\\"',
  '\\r?\\n',
  '?:'
  + '(-?(?:0|[1-9]\\d*))'
  + '(\\.\\d+)?'
  + '([eE][-+]?\\d+)?',
  '\\w+',
  '[!@$=\\(\\)\\{\\}\\[\\]:]|\\.{3}',
  '?:[^\\s,]'
].map(exp => `(${exp})`).join('|');

function test1() {
  const scanner = new RegExp(pattern, 'g');
  const scan = scanner.exec.bind(scanner, source);

  let token = scan();
  while (token !== null) {
    token = scan();
  }
}

class Scanner {
  constructor(source) {
    this.index = 0;
    this.source = source;

    this.scan = this.scan.bind(this);
  }

  scan() {
    if (this.index === this.source.length) return null;

    let char = this.source[this.index];
    while ((char === ' ' || char === '\n') && this.index < this.source.length) {
      this.index = this.index + 1;
      char = this.source[this.index];
    }
    const startIndex = this.index;

    if (this.index === this.source.length) return null;

    while ((char !== ' ' && char !== '\n') && this.index < this.source.length) {
      this.index = this.index + 1;
      char = this.source[this.index];
    }
    const endIndex = this.index;

    return this.source.slice(startIndex, endIndex);
  }
}

function test2() {
  const scanner = new Scanner(source);
  const scan = scanner.scan;

  let lexeme = scan();
  //console.log(lexeme);
  while (lexeme !== null) {
    lexeme = scan();
    //console.log(lexeme);
  }
}

//test2();

mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);
mp(test1, testCount);
mp(test2, testCount);