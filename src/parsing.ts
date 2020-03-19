import { Lexer, Token, TokenKind } from "./lexing";
import { Identifier, Document, FragmentDefinition, OperationDefintion, Selection, Field, FragmentSpread, InlineFragment, Argument, Type, Value, Literal, StringValue, IntValue, FloatValue, Variable, ListValue, ObjectValue, ObjectField, EnumValue, Enclosing, VariableDefinition, NamedType, NonNullType, ListType, BooleanValue, NullValue } from './syntax-tree';

class SyntaxError extends Error {
  token: Token;
  
  constructor(token: Token, expected?: string) {

    expected = expected && expected.length === 1 ? `'${expected}'` : expected;
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
    let operationDefinitions: OperationDefintion[] = [],
      fragmentDefinitions: FragmentDefinition[];

    let token = this.lexer.read();
    while (token !== null) {

      if (token.kind !== TokenKind.Name && token.value !== '{') throw new SyntaxError(token);

      if (token.kind === TokenKind.Name && token.value === 'fragment') {
        if (fragmentDefinitions === undefined) fragmentDefinitions = [];
        const definition = this.parseFragmentDefinition();
        fragmentDefinitions.push(definition);
      }
      
      const definition = this.parseOperationDefinition(token);
      operationDefinitions.push(definition);

      token = this.lexer.read();
    }

    return new Document(operationDefinitions, fragmentDefinitions);
  }

  private parseOperationDefinition(token: Token): OperationDefintion {
    let type: Identifier,
      name: Identifier,
      variableDefinitions: VariableDefinition[],
      selectionSet: Selection[];

    if (token.kind === TokenKind.Name) {

      if (token.value !== 'query'
        && token.value !== 'mutation'
        && token.value !== 'subscription'
      ) throw new SyntaxError(token);
      type = new Identifier(token);

      token = this.lexer.read();
      if (token.kind === TokenKind.Name) {

        name = new Identifier(token);
        token = this.lexer.read();
      }

      if (token.value === '(') {

        variableDefinitions = [];
        token = this.lexer.read();
        do {
          const definition = this.parseVariableDefinition(token);
          variableDefinitions.push(definition);
    
        } while (token.value !== ')');

        token = this.lexer.read();
      }

      if (token.value !== '{') throw new SyntaxError(token, '{');
    }

    selectionSet = this.parseSelectionSet();

    return new OperationDefintion(selectionSet, type, name, variableDefinitions);
  }

  private parseVariableDefinition(indicator: Token): VariableDefinition {
    let variable: Variable,
      type: Type,
      defaultValue: Literal;
    
    variable = this.parseVariable(indicator);

    let token = this.lexer.read();
    if (token.value !== ':') throw new SyntaxError(token, ':');

    token = this.lexer.read();
    type = this.parseType(token);

    token = this.lexer.read();
    if (token.value === '!') {

      type = new NonNullType(token, type);
      token = this.lexer.read();
    }

    if (token.value === '=') {
      token = this.lexer.read();
      defaultValue = <Literal>this.parseValue(token, false);
      token = this.lexer.read();
    }

    return new VariableDefinition(variable, type, defaultValue);
  }

  private parseType(token: Token): Type {
    if (token.kind === TokenKind.Name) {

      const name = new Identifier(token);
      return new NamedType(name);
    }
    else if (token.value === '[') {

      const startToken = token;
      token = this.lexer.read();
      let type = this.parseType(token);

      token = this.lexer.read();
      if (token.value === '!') {

        type = new NonNullType(token, type);
        token = this.lexer.read();
      }
      else if (token.value === ']') {
        const location = new Enclosing(startToken, token);
        return new ListType(location, type);
      }
      else throw new SyntaxError(token, ']');
    }
    else throw new SyntaxError(token);
  }

  private parseFragmentDefinition(): FragmentDefinition {

    let token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
    const name = new Identifier(token);

    token = this.lexer.read();
    if (token.value !== 'on') throw new SyntaxError(token, 'on');

    token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(token, 'name');
    const typeCondition = new Identifier(token);

    token = this.lexer.read();
    if (token.value !== '{') throw new SyntaxError(token, '{');
    const selectionSet = this.parseSelectionSet();

    return new FragmentDefinition(name, typeCondition, selectionSet);
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

  private parseValue(token: Token, allowVariable = true): Value {

    switch (token.value) {
      case '$':
        if (allowVariable) return this.parseVariable(token);
        else throw new SyntaxError(token);
      case '[': return this.parseListValue(token);
      case '{': return this.parseObjectValue(token);
    }

    if (token.kind === TokenKind.Punctuator) throw new SyntaxError(token);

    switch (token.kind) {
      case TokenKind.StringLiteral: return new StringValue(token);
      case TokenKind.IntLiteral: return new IntValue(token);
      case TokenKind.FloatLiteral: return new FloatValue(token);
      case TokenKind.Name:
        switch (token.value) {
          case 'null': return new NullValue(token);
          case 'true' || 'false': return new BooleanValue(token);
          default: return new EnumValue(token);
        }
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