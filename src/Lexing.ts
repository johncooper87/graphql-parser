const matchToken = [

  // string literal
  '"(?:.|\\s)*?"',
  // float literal
  '(?:-)?\\d+(?:(?:\\.\\d+[eE][-+]?\\d+)|(?:\\.\\d+)|(?:[eE][-+]?\\d+))',
  // int literal
  '(?:-)?(?:0|[1-9]\\d*)',
  // operation type identifier: 'query', 'mutation', 'subscription'
  // fragment identifier: 'fragment'
  // type condition identifier: 'on'
  // definition identifier: 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'
  // name identifier (operation, variable, type, alias, field, argument)
  // boolean literal
  // null literal
  // enum value
  '\\w+',
  // '...' - spread operator
  // '$' - variable identifier
  // '!' - nonnull value identifier
  // '@' - directive identifier
  // ':', '=', '|'
  // separator: '{', '}', '(', ')', '[', ']'
  // ... invalid token
  '(\\.{3})|([^\\s,])'
  
].map(exp => `(${exp})`).join('|');

export enum TokenKind {
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

  constructor(value: string, kind: TokenKind, start: number) {
    this.value = value;
    this.kind = kind;
    this.start = start;
  }

  get end(): number {
    return this.start + this.value.length;
  }
}

export class Lexer {
  readonly document: string;
  private matchToken: RegExp;

  constructor(document: string) {
    this.document = document;
    this.matchToken = new RegExp(matchToken, 'g');
  }

  nextToken(): Token {
    const token = this.matchToken.exec(this.document);
    const tokenKind = token.indexOf(token[0], 1);
    return new Token(token[0], tokenKind, token.index);
  }
}
