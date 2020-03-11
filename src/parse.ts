import { Lexer, TokenKind, Token } from "./lexing";
import ParseError from './ParseError';
import { Document, FragmentDefinition, Operation } from './syntax-tree';

export default class Context {
  lexer: Lexer;
  private errors: ParseError[] = [];

  constructor(source: string) {
    this.lexer = new Lexer(source);
    this.pushError = this.pushError.bind(this);
  }

  pushError(error: ParseError) {
    this.errors.push(error);
  }
}

export class ParseContext {
  lexer: Lexer;
  document: Document;
  errors: ParseError[] = []

  constructor(source) {
    this.lexer = new Lexer(source);
  }

  parseDocument() {
    this.document = new Document();

    let token = this.lexer.read();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') this.parseFragment();

        if (token.value !== 'query'
          && token.value !== 'mutation'
          && token.value !== 'subscription'
        ) throw new ParseError(`Unexpected ${token}.`, token);
        this.parseOperation(token.value);

      } else if (token.value === '{') this.parseOperation('query', null);
      else throw new ParseError(`Unexpected '${token}'.`, token);

    }
  }

  parseSelectionSet() {
    let token = this.lexer.read();
    if (token.value !== '{') throw new ParseError(`Expected 'on', found ${token}.`);

    token = this.lexer.read();
  }

  parseField() {

  }

  private parseFragment() {
    let token = this.lexer.read();
    if (token === null) throw new ParseError(`Identifier expected.`, token);
    if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);

    const name = token.value;
    if (this.document.fragmentDefinitions.has(name)) throw new ParseError(`Duplicate identifier '${name}'.`, token);

    token = this.lexer.read();
    if (token === null) throw new ParseError(`Type condition expected.`, token);
    if (token.value !== 'on') throw new ParseError(`Expected 'on', found ${token}.`);

    token = this.lexer.read();
    const type = token.value;
    //this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
  }

  private parseOperation(operationType: string, nameToken?: Token) {
    if (nameToken === undefined) {

        const token = this.lexer.read();
        if (token.kind === TokenKind.Name) this.parseOperation(operationType, token);
        else if (token.value === '{') this.parseOperation(operationType, null);
        else throw new ParseError(`Expected '{', found ${token}.`, token);

    } else {

      const name = nameToken?.value;
      if (this.document.operations.has(name)) {
        if (name === null) throw new ParseError(`Only one anonymous operation allowed.`);
        throw new ParseError(`Duplicate identifier '${name}'.`, nameToken);
      }
      //this.operations.set(name, new Operation(operationType, name, lexer));

    }
    
  }




}

// export default function parse(source: string) {
//   const parser = new Parser(source);
//   return parser.parseDocument();
// }



function a() {
  const a = 5;
  const a = 5;
  return a;
}