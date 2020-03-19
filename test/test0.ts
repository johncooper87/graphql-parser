import { Parser } from '../src/parsing';
import { Token } from '../src/lexing';

const source = `
  query op{
    lala
    lalala(f: "asd")
    eee {
      asd
      ...on EEE {
        ttt
      }
    }
  }
`;

function printError(message: string, token: Token) {
  if (token == null) {
    console.log(message);
    return;
  }

  const { value, line, lineOffset, column } = token;

  let nextLineOffset: number;
  if (token === null) nextLineOffset = source.length;
  else {
    const scanner = /\r?\n/g;
    scanner.lastIndex = lineOffset + column + value.length;
    nextLineOffset = scanner.exec(source)?.index || source.length;
  }

  const msg = message + ` (line ${line + 1}, column ${column + 1})\n`
  + source.slice(0, nextLineOffset)
  + '\n'
  + ' '.repeat((column || 1) - 1) + '^'.repeat(value.length)
  + source.slice(nextLineOffset)

  console.log(msg);
}

const parser = new Parser(source);
let ast;

try {
  ast = parser.parseDocument();
} catch (error) {
  printError(error.message, error.token);
}

console.log(ast);