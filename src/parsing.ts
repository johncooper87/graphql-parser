import { Lexer, Token, TokenKind } from "./lexing";
import { Identifier, Document, FragmentDefinition, OperationDefintion, Selection, Field, FragmentSpread, InlineFragment, Argument, Value, Literal, StringValue, IntValue, FloatValue, Variable, ListValue, ObjectValue, ObjectField, EnumValue, Enclosing } from './syntax-tree';

class SyntaxError extends Error {
  token: Token;
  
  constructor(token: Token, expected?: string) {

    expected = expected.length === 1 ? `'${expected}'` : expected;
    const message = expected
      ? `Expected ${expected}, found ${token}`
      : `Unexpected ${token}`;

    super(message);
    this.token = token;
    this.name = 'SyntaxError';
  }
}

export class Parser {

  private lexer: Lexer;

  constructor(source: string) {
    this.lexer = new Lexer(source);
  }

  parseDocument(): Document {
    let operationDefinitions: OperationDefintion[],
      fragmentDefinitions: FragmentDefinition[];

    let token = this.lexer.read();
    while (token !== null) {

      if (token.kind !== TokenKind.Name && token.value !== '{') throw new SyntaxError(token);

      if (token.kind === TokenKind.Name && token.value !== 'fragment') {
        if (fragmentDefinitions === undefined) fragmentDefinitions = [];
        const fragmentDefinition = this.parseFragmentDefinition();
        fragmentDefinitions.push(fragmentDefinition);
      }
      
      if (operationDefinitions === undefined) operationDefinitions = [];
      const operationDefinition = this.parseOperationDefinition(token);
      operationDefinitions.push(operationDefinition);

      token = this.lexer.read();
    }

    return new Document(operationDefinitions, fragmentDefinitions);
  }

  private parseFragmentDefinition(): FragmentDefinition {

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

  private parseOperationDefinition(): OperationDefintion {

    if (token.value !== 'query'
          && token.value !== 'mutation'
          && token.value !== 'subscription'
        ) throw new SyntaxError(token);
        this.parseOperation(token.value);

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
    const selectionSet: Selection[] = [];

    let token = this.lexer.read();
    do {

      if (token.kind === TokenKind.Name) {

        const identifier = new Identifier(token);
        const field = this.parseField(identifier);
        selectionSet.push(field);
      }
      else if (token.value === '...') {

        const fragmentSpread = this.parseFragmentSpread();
        selectionSet.push(fragmentSpread);
      }
      else throw new SyntaxError(token);

      token = this.lexer.read();
    } while (token.value !== '}');

    return selectionSet;
  }

  private parseFragmentSpread() {
    let token = this.lexer.read();

    if (token.kind === TokenKind.Name) {

      const name = new Identifier(token);
      return new FragmentSpread(name);
    }
    else if (token.value === 'on') {

      token = this.lexer.read();
      if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
      const typeCondition = new Identifier(token);

      token = this.lexer.read();
      if (token.value !== '{') throw new SyntaxError(token, '{');
      const selectionSet = this.parseSelectionSet();

      return new InlineFragment(typeCondition, selectionSet);
    }
    else throw new SyntaxError(token, 'on');
  }

  private parseField(identifier: Identifier): Field {
    let name: Identifier,
      alias: Identifier,
      args: Argument[],
      selectionSet: Selection[];

    let token = this.lexer.read();
    if (token.value === ':') {

      token = this.lexer.read();
      if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
      name = new Identifier(token);
      alias = identifier;
      token = this.lexer.read();
    }
    else name = identifier;

    if (token.value === '(') args = this.parseArguments();

    if (token.value === '{') selectionSet = this.parseSelectionSet();

    return new Field(name, alias, args, selectionSet);
  }

  private parseArguments(): Argument[] {
    const args: Argument[] = [];

    let token = this.lexer.read();
    do {

      if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
      const name = new Identifier(token);

      token = this.lexer.read();
      if (token.value !== ':') throw new SyntaxError(token, ':');

      token = this.lexer.read();
      const value = this.parseValue(token);

      const arg = new Argument(name, value);
      args.push(arg);

      token = this.lexer.read();
    } while (token.value !== ')');

    return args;
  }

  private parseValue(token: Token): Value {

    switch (token.value) {
      case '$': return this.parseVariable(token);
      case '[': return this.parseListValue(token);
      case '{': return this.parseObjectValue(token);
    }

    if (token.kind === TokenKind.Punctuator) throw new SyntaxError(token);

    switch (token.kind) {
      case TokenKind.StringLiteral: return new StringValue(token);
      case TokenKind.IntLiteral: return new IntValue(token);
      case TokenKind.FloatLiteral: return new FloatValue(token);
      case TokenKind.Name: return new EnumValue(token);
    }
  }

  private parseVariable(indicator: Token): Variable {

    const token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
    const name = new Identifier(token);

    return new Variable(indicator, name);
  }

  private parseListValue(startToken: Token): ListValue {
    let values: Value[];

    let token = this.lexer.read();
    if (token.value !== ']') values = [];
    while (token.value !== ']') {

      const value = this.parseValue(token);
      values.push(value);

      token = this.lexer.read();
    }

    const location = new Enclosing(startToken, token);
    return new ListValue(location, values);
  }

  private parseObjectValue(startToken: Token): ObjectValue {
    let fields: ObjectField[];

    let token = this.lexer.read();
    if (token.value !== '}') fields = [];
    while (token.value !== '}') {

      if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
      const name = new Identifier(token);

      token = this.lexer.read();
      if (token.value !== ':') throw new SyntaxError(token, ':');

      token = this.lexer.read();
      const value = this.parseValue(token);

      const field = new ObjectField(name, value);
      fields.push(field);

      token = this.lexer.read();
    }

    const location = new Enclosing(startToken, token);
    return new ObjectValue(location, fields);
  }

}