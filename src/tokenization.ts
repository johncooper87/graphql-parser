const pattern = [

  // string literal
  '\\"(?:[^"\\\\]|\\\\.)*\\"',

  // newline
  '?:\\r?\\n',

  // integer literal
  // floating-point literal
  '?:-?(0|[1-9]\\d*)((?:\\.\\d+)?(?:[eE][-+]?\\d+)?)',

  // operation type: 'query', 'mutation', 'subscription'
  // fragment indicator: 'fragment'; type condition: 'on'
  // identifier (operation, variable, type, alias, field, argument)
  // boolean literal: 'true', 'false'
  // null literal: 'null'
  // enum element literal
  '\\w+',
  
  // '=', ':'
  // '...' - spread operator
  // '!' - nonnull value indicator
  // '@' - directive indicator
  // '$' - variable indicator
  // separator: '(', ')', '{', '}', '[', ']'
  '[!@$=\\(\\)\\{\\}\\[\\]]|\\.{3}',

  // unexpected
  '[^\\s,]'

  // DEPRECATED:
  // 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'
  // '|'
  
].map(exp => `(${exp})`).join('|');

interface ScanResult {
  /** Lexeme */
  0: string;
  /** String literal */
  1: string;
  /** The integer part of a numeric literal */
  2: string;
  /** The fractional part and/or exponential notation of a numeric literal */
  3: string;
  /** */
  4: string;
  /** */
  5: string;
  /** */
  6: string;
}

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
  readonly line: number;
  readonly column: number;

  constructor(value: string, kind: TokenKind, line: number, column: number) {
    this.value = value;
    this.kind = kind;
    this.line = line;
    this.column = column;
  }

  toString() {
    switch (this.kind) {
      case 1:
        return `string: ${this.value.replace(/\r?\n/g, '\\n')}`;
      case 2:
        return `int: ${this.value}`;
      case 3:
        return `float: ${this.value}`;
      default:
        return `'${this.value}'`;
    }
  }
}

export class Lexer {
  readonly source: string;
  readonly lastToken: Token;
  private readonly scan: () => ScanResult;

  constructor(source: string) {
    this.source = source;
    const scanner = new RegExp(pattern, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  nextToken(): Token {
    //if (this.lastToken === null) return null;
    const lexeme = this.scan();
    if (lexeme === null) return null;

    let value: string, kind: TokenKind;
    // if 
    if (lexeme[4] !== undefined) {
      value = lexeme[0];
      kind = TokenKind.Name;
    }
    // 
    else if (lexeme[5] !== undefined) {
      value = lexeme[0];
      kind = TokenKind.Punctuator;
    }
    // If the lexeme has the integer part then it is a numeric literal
    else if (lexeme[2] !== undefined) {
      value = lexeme[0];
      // If the lexeme does not have the fractional part or exponential notation
      // then it is an integer literal, otherwise it is a floating-point literal
      kind = lexeme[3] === undefined ? TokenKind.IntLiteral : TokenKind.FloatLiteral;
    }
    // the lexeme has string value
    else if (lexeme[1] !== undefined) {
      value = lexeme[1];
      kind = TokenKind.StringLiteral;
    }
    else if (lexeme[6] !== undefined) {
      //handle unexpected token
    }

    // @ts-ignore
    //this.lastToken = new Token(value, kind, res.index);
    this.lastToken = new Token(value, kind, lexeme.index);
    return this.lastToken;
  }

  emitError(message: string) {
    const { lastToken: { column: tokenStart } } = this;
    const lineStart = this.source.lastIndexOf('\n', tokenStart);
    const lineEnd = this.source.indexOf('\n', tokenStart);
    throw new Error(
      message
      + this.source.substring(lineStart, lineEnd)
      + '\n'
      + ' '.repeat(tokenStart - lineStart - 1) + '^'.repeat(this.lastToken.value.length)
    );
  }
}