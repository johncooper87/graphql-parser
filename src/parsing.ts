import  { SyntaxError } from './SyntaxError';
import  { SemanticError } from './SemanticError';
import { Lexer, Token, TokenKind } from "./lexing";
import { Identifier, Document, FragmentDefinition, OperationDefintion, Selection, Field, FragmentSpread, InlineFragment, Argument, Value, Literal, StringValue, IntValue, FloatValue, Variable, ListValue, ObjectValue, ObjectField } from './syntax-tree';

export class Parser {

  private lexer: Lexer;
  private errors: SemanticError[] = []
  private document: Document;
  private rootNode: any;

  constructor(source: string) {
    this.lexer = new Lexer(source);
  }

  private pushError(message: string, token: Token) {
    this.errors.push(new SemanticError(message, token));
  }

  parseDocument(): void {

    this.document = new Document();
    let token = this.lexer.read();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') this.parseFragmentDefinition();

        if (token.value !== 'query'
          && token.value !== 'mutation'
          && token.value !== 'subscription'
        ) throw new SyntaxError(`Unexpected ${token}.`, token);
        this.parseOperation(token.value);

      } else if (token.value === '{') this.parseOperation('query', null);
      else throw new SyntaxError(`Unexpected '${token}'.`, token);

    }
  }

  private parseFragmentDefinition(): void {

    let token = this.lexer.read();
    if (token === null) throw new SyntaxError(`Identifier expected.`, token);
    if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);

    const name = token.value;
    if (this.document.fragmentDefinitions.has(name)) {
      this.pushError(`Duplicate identifier '${name}'.`, token);
    }

    token = this.lexer.read();
    if (token === null) throw new SyntaxError(`Type condition expected.`, token);
    if (token.value !== 'on') throw new SyntaxError(`Expected 'on', found ${token}.`);

    token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
    const type = token.value;
    //this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
  }

  private parseOperation(operationType: string, nameToken?: Token): void {

    if (nameToken === undefined) {

      const token = this.lexer.read();
      if (token.kind === TokenKind.Name) this.parseOperation(operationType, token);
      else if (token.value === '{') this.parseOperation(operationType, null);
      else throw new SyntaxError(`Expected '{', found ${token}.`, token);

    } else {

      const name = nameToken?.value;
      if (this.document.operations.has(name)) {
        if (name === null) throw new SyntaxError(`Only one anonymous operation allowed.`);
        this.pushError(`Duplicate identifier '${name}'.`, nameToken);
      }
      //this.operations.set(name, new Operation(operationType, name, lexer));

    }
  }

  private parseSelectionSet(): Selection[] {
    //let token = this.lexer.read();
    //if (token.value !== '{') throw new SyntaxError(`Expected 'on', found ${token}.`);

    let token = this.lexer.read();

    const selectionSet: Selection[] = [];

    while (token.value !== '}') {

      if (token.kind === TokenKind.Name) {
        const identifier = new Identifier(token);
        const field = this.parseField(identifier);
        selectionSet.push(field);
      }
      else if (token.value === '...') {
        const fragmentSpread = this.parseFragmentSpread();
        selectionSet.push(fragmentSpread);
      }
      else throw new SyntaxError(`Unexpected ${token}.`, token);
    }

    return selectionSet;

  }

  private parseField(identifier: Identifier): Field {
    let name: Identifier,
      alias: Identifier,
      selectionSet: Selection[];

    let token = this.lexer.read();
    if (token.value === ':') {

      token = this.lexer.read();
      if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
      name = new Identifier(token);
      alias = identifier;
      token = this.lexer.read();
    }
    else name = identifier;

    //if (token.value === '(')
    // parse arguments

    if (token.value === '{') selectionSet = this.parseSelectionSet();

    return new Field(name, alias, undefined, selectionSet);
  }

  private parseArguments(): Argument[] {
    const args: Argument[] = [];

    let token = this.lexer.read();
    while (token.value !== ')') {

      if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
      const name = new Identifier(token);

      token = this.lexer.read();
      if (token.value !== ':') throw new SyntaxError(`Expected ':', found ${token}.`, token);

      const value = this.parseValue();
      args.push(new Argument(name, value));
    }

    return args;
  }

  private parseValue(): Value {

    let token = this.lexer.read();
    if (token.value === '$') return this.parseVariable(token);
    else if (token.value === '[') return this.parseListValue(token);
    else if (token.value === '{') return this.parseObjectValue(token);
    else if (token.kind === TokenKind.Punctuator) throw new SyntaxError(`Unexpected ${token}.`, token);
    else return this.parseLiteral(token);
  }

  private parseLiteral(token: Token): Literal {
    switch (token.kind) {
      case TokenKind.StringLiteral:
        return new StringValue(token);
      case TokenKind.IntLiteral:
        return new IntValue(token);
      case TokenKind.FloatLiteral:
      return new FloatValue(token);
    }
  }

  private parseVariable(indicator: Token): Variable {
    const token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
    const name = new Identifier(token);
    return new Variable(indicator, name);
  }

  private parseListValue(startToken: Token): ListValue {

  }

  private parseObjectValue(startToken: Token): ObjectValue {

  }

  private parseObjectField(): ObjectField {

  }

  private parseFragmentSpread() {
    let token = this.lexer.read();

    if (token.kind === TokenKind.Name) {
      const name = new Identifier(token);
      return new FragmentSpread(name);
    }
    else if (token.value === 'on') {

      token = this.lexer.read();
      if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
      const typeCondition = new Identifier(token);

      token = this.lexer.read();
      if (token.value !== '{') throw new SyntaxError(`Expected '{', found ${token}.`, token);
      const selectionSet = this.parseSelectionSet();
      //if (selectionSet.length === 0) throw new SyntaxError();

      return new InlineFragment(typeCondition, selectionSet);
    }
    else throw new SyntaxError(`Expected 'on', found ${token}.`, token);
  }


}