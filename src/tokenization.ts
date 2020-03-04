const tokenPattern = [

  // string literal
  '?:\\"((?:[^"\\\\]|\\\\.)*)\\"',

  // integer literal
  // floating point literal
  '?:-?(0|[1-9]\\d*)(\\.\\d+)?([eE][-+]?\\d+)?',

  // operation type: 'query', 'mutation', 'subscription'
  // fragment indicator: 'fragment'; type condition: 'on'
  // identifier (operation, variable, type, alias, field, argument)
  // boolean literal: 'true', 'false'
  // null literal
  // enum value literal
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

export const enum TokenKind {
  StringValue = 1,
  IntValue,
  FloatValue,
  Name,
  Punctuator
}


interface tokenSearchResult {
  /**
   * intger part
   */
  2: string;
}

export class Token {
  readonly value: string;
  readonly kind: TokenKind;
  readonly start: number;

  constructor(res: {
    1: string,
    /** integer part */
    2: string, // integer part
    3: string;
    4: string;
  }) {

    if (res[1] !== undefined) {
      this.value = res[1];
      this.kind = TokenKind.StringValue;
    } else if (res[2] !== undefined) {
      if (res[3] !== undefined || res[4] !== undefined) {
        this.value = res[0];
        this.kind = TokenKind.FloatValue;
      } else {
        this.value = res[0];
        this.kind = TokenKind.IntValue;
      }
    } else if (res[5] !== undefined) {
      this.value = res[0];
      this.kind = TokenKind.Name;
    } else if (res[6] !== undefined) {
      this.value = res[0];
      this.kind = TokenKind.Punctuator;
    } if (res[7] !== undefined) {
      this.value = res[0];
      this.kind = TokenKind.Punctuator;
    }
    // this.value = value;
    // this.kind = kind;
    // this.start = start;
    // this.value = match[0];
    // const kind = match.indexOf(this.value, 1);

    // // handle unexpected token
    // if (kind === 6) {
    //   if (this.value = '"')

    // }
    // this.kind = kind === 2 && match[3] !== '' ? kind + 1 : kind;
    // this.start = match.index;
  }

  toString() {
    switch (this.kind) {
      case 1:
        return `string '${this.value.replace(/\n/g, '\\n')}'`;
      case 2:
        return `int '${this.value}'`;
      case 3:
        return `float '${this.value}'`;
      default:
        return `'${this.value}'`;
    }
  }
}

export class Tokenizer {
  readonly source: string;
  private scanner: RegExp;
  readonly lastToken: Token;

  constructor(source: string) {
    this.source = source;
    this.scanner = new RegExp(tokenPattern, 'g');
  }

  nextToken(): Token {
    //if (this.lastToken === null) return null;
    const res = this.scanner.exec(this.source);
    if (res === null) return null;

    let value: string, kind: number;
    if (res[1] !== undefined) {
      value = res[1];
      kind = TokenKind.StringValue;
    } else if (res[2] !== undefined) {
      if (res[3] !== undefined || res[4] !== undefined) {
        value = res[0];
        kind = TokenKind.FloatValue;
      } else {
        value = res[0];
        kind = TokenKind.IntValue;
      }
    } else if (res[5] !== undefined) {
      value = res[0];
      kind = TokenKind.Name;
    } else if (res[6] !== undefined) {
      value = res[0];
      kind = TokenKind.Punctuator;
    } if (res[7] !== undefined) {
      value = res[0];
      kind = TokenKind.Punctuator;
    }
    console.log(res);

    // const value = res[0];
    // let kind = res.indexOf(value, 1);
    // // handle unexpected token
    // if (kind === 6) {
    //   if (value === '"') this.emitError
      
    // }
    // // if the result has a fractional or exponent part
    // if (kind === 2 && res[3] !== '') kind++;

    // @ts-ignore
    this.lastToken = new Token(value, kind, res.index);
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