const searchToken = [

  // string literal
  '"(?:[^"\\\\]|\\\\.)*"',

  // float literal
  '(?:-)?\\d+(?:(?:\\.\\d+[eE][-+]?\\d+)|(?:\\.\\d+)|(?:[eE][-+]?\\d+))',

  // int literal
  '(?:-)?(?:0|[1-9]\\d*)',

  // operation type: 'query', 'mutation', 'subscription'
  // fragment indicator: 'fragment'; type condition: 'on'
  // (invalid) 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'
  // identifier (operation, variable, type, alias, field, argument)
  // boolean literal
  // null literal
  // enum value
  '\\w+',
  
  // '...' - spread operator
  // '$' - variable indicator
  // '!' - nonnull value indicator
  // '@' - directive indicator
  // ':', '=',
  // separator: '{', '}', '(', ')', '[', ']'
  // (invalid) '|'
  // invalid token
  '(\\.{3})|([^\\s,])'
  
].map(exp => `(${exp})`).join('|');

export const enum TokenKind {
  StringLiteral = 1,
  FloatLiteral,
  IntLiteral,
  Name,
  Punctuator
}

export class Token {
  readonly value: string;
  readonly kind: TokenKind;
  readonly start: number;

  constructor(match: RegExpExecArray) {
    this.value = match[0];
    this.kind = match.indexOf(this.value, 1);
    this.start = match.index;
  }

  toString() {
    switch (this.kind) {
      case 1:
        return `string ${this.value.replace(/\n/g, '\\n')}`;
      case 2:
        return `float ${this.value}`;
      case 3:
        return `int ${this.value}`;
      default:
        return `'${this.value}'`;
    }
  }
}

export class Tokenizer {
  readonly source: string;
  private searchToken: RegExp;
  readonly lastToken: Token;

  constructor(source: string) {
    this.source = source;
    this.searchToken = new RegExp(searchToken, 'g');
  }

  nextToken(): Token {
    //if (this.lastToken === null) return null;
    const match = this.searchToken.exec(this.source);
    if (match === null) return null;
    // @ts-ignore
    this.lastToken = new Token(match);
    return this.lastToken;
  }

  emitError(message: string) {
    const { lastToken: { start: tokenStart } } = this;
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