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
  readonly line: number;
  readonly lineOffset: number;
  readonly column: number;

  constructor(value: string, kind: TokenKind, line: number, lineOffset: number, column: number) {
    this.value = value;
    this.kind = kind;
    this.line = line;
    this.lineOffset = lineOffset;
    this.column = column;
  }

  toString() {
    switch (this.kind) {
      case TokenKind.StringLiteral:
        return `string: ${this.value}`;
      case TokenKind.IntLiteral:
        return `int: ${this.value}`;
      case TokenKind.FloatLiteral:
        return `float: ${this.value}`;
      default:
        return `'${this.value}'`;
    }
  }
}

class LexicalError extends Error {
  token: Token;

  constructor(message: string, token: Token) {
    super(message);
    this.token = token;
    this.name = 'LexicalError';
  }
}

export class Lexer {

  readonly source: string;
  private currentLine: number = 0;
  private currentLineOffset: number = 0;
  private scan: () => RegExpExecArray;

  constructor(source: string) {
    this.source = source;
    const scanner = new RegExp(pattern, 'g');
    this.scan = scanner.exec.bind(scanner, this.source);
  }

  read(): Token {

    const {
      0: lexeme,
      1: stringLiteral,
      2: newline,
      3: integerPart, 4: fractionalPart, 5: eNotation,
      6: name,
      7: punctuator,
      index: offset
    }: any = this.scan() || {};

    if (lexeme === undefined) return null;

    if (newline !== undefined) {
      this.currentLine++;
      this.currentLineOffset = offset;
      return this.read();
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

    const token = new Token(lexeme, kind, this.currentLine, this.currentLineOffset, offset - this.currentLineOffset);
    if (kind === undefined){
      if (lexeme === '"') throw new LexicalError(`Unterminated string`, token);
      throw new LexicalError(`Illegal character '${token.value}'`, token);
    }
    return token;
  }
}