const pattern = [

  '\\"(?:[^"\\\\]|\\\\.)*\\"', // string literal (1)

  '\\r?\\n', // newline (2)

  // Numeric literals:
  // 1. Integer literal;
  // 2. Floating-point literal.
  '?:'
  + '(-?(?:0|[1-9]\\d*))' // integer part (3)
  + '(\\.\\d+)?' // fractional part (4)
  + '([eE][-+]?\\d+)?', // exponential notation (5)

  // 1. Keywords:
  // 1.1. Operation types: 'query', 'mutation', 'subscription';
  // 1.2. Fragment definition: 'fragment'; type condition: 'on';
  // 1.3. Boolean literals: 'true' or 'false';
  // 1.4. Null value literal: 'null'.
  // 1.5. Deprecated: 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'.
  // 2. Identifiers: operation, variable, type, alias, field, argument, enum element.
  '\\w+', // name (6)
  
  // 1. Indicators: 
  // 1.1 Directive: '@';
  // 1.2 Variable: '$';
  // 1.3 Nonull value: '!'.
  // 2. Operators:
  // 2.1. Fragment spread: '...';
  // 2.2. Assignment: '='.
  // 3. Separators: '(', ')', '{', '}', '[', ']', ':'.
  // 3.1. Deprecated: '|'.
  '[!@$=\\(\\)\\{\\}\\[\\]:]|\\.{3}', // punctuator (7)

  '?:[^\\s,]' // invalid

].map(exp => `(${exp})`).join('|');

export const enum TokenKind {
  StringLiteral,
  IntLiteral,
  FloatLiteral,
  Name,
  Punctuator
}

export class Token {

  readonly value: string;
  readonly kind: TokenKind;
  readonly source: string;
  readonly line: number;
  readonly lineOffset: number;
  readonly column: number;

  constructor(value: string, kind: TokenKind, source: string, line: number, lineOffset: number, column: number) {
    this.value = value;
    this.kind = kind;
    this.source = source;
    this.line = line;
    this.lineOffset = lineOffset;
    this.column = column;
  }

  toString() {
    switch (this.kind) {
      case TokenKind.StringLiteral:
        return 'string';
      case TokenKind.IntLiteral:
        return 'int';
      case TokenKind.FloatLiteral:
        return 'float';
      default:
        return `'${this.value}'`;
    }
  }
}

export class Lexer {

  readonly source: string;
  //private lastToken: Token;
  private currentLine: number = 0;
  private currentLineOffset: number = 0;
  private scan: () => RegExpExecArray;

  constructor(source: string) {
    this.source = source;
    const scanner = new RegExp(pattern, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  nextToken(): Token {
    //if (this.lastToken === null) return null;

    const {
      0: lexeme,
      1: stringLiteral,
      2: newline,
      3: integerPart, 4: fractionalPart, 5: eNotation,
      6: name,
      7: punctuator,
      index: offset
    }: any = this.scan() || {};

    if (lexeme === undefined) {
      //this.lastToken = null;
      return null;
    }

    if (newline !== undefined) {
      this.currentLine++;
      this.currentLineOffset = offset;
      return this.nextToken();
    }

    const kind =
      name !== undefined ? TokenKind.Name
      : punctuator !== undefined ? TokenKind.Punctuator
      // If the lexeme has the integer part then it is at least a numeric literal.
      : integerPart !== undefined ? 
        // If the lexeme does not have the fractional part or exponential notation
        // then it is an integer literal, otherwise it is a floating-point literal.
        fractionalPart === undefined && eNotation === undefined
        ? TokenKind.IntLiteral
        : TokenKind.FloatLiteral
      : stringLiteral !== undefined ? TokenKind.StringLiteral
      : undefined;

    if (kind === undefined){
      //handle invalid
    }

    //this.lastToken = new Token(lexeme, kind, this.source, this.currentLine, this.currentLineOffset, offset - this.currentLineOffset);
    //return this.lastToken;
    return new Token(lexeme, kind, this.source, this.currentLine, this.currentLineOffset, offset - this.currentLineOffset);
  }
}

export class InvalidToken extends Error {
  constructor(message: String, token: Token) {
    const { value, source, line, lineOffset, column } = token;

    const scanner = /\r?\n/g;
    scanner.lastIndex = lineOffset + column + value.length;
    const nextLineOffset = scanner.exec(source)?.index || source.length;

    super( 
      message + ` (line ${line}, column ${column})\n`
      + source.slice(0, nextLineOffset)
      + '\n'
      + ' '.repeat((column || 1) - 1) + '^'.repeat(value.length)
      + source.slice(nextLineOffset)
    );

    this.name = 'InvalidToken';
  }
}

// const query = `
//   query operation($limit: Int) {
//     users {
//       firstname
//       lastname
//       email
//     }
//   }
// `;

// const lexer = new Lexer(query);
// let token;
// for (let i = 0; i < 12; i++) {
//   token = lexer.nextToken();
// }
// throw new InvalidToken('Unexpected token', token);