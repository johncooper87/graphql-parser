import { Token } from './lexing';

export class Identifier {
  token: Token;
  value: string;

  constructor(token: Token) {
    this.token = token;
    this.value = token.value;
  }
}

export class Variable {
  token: Token;
  name: Identifier;

  constructor(token: Token, name: Identifier) {
    this.token = token;
    this.name = name;
  }
}

export class StringValue {
  token: Token;
  value: string;

  constructor(token: Token) {
    this.token = token;
    this.value = token.value.slice(1, -1);
  }
}

export class IntValue {
  token: Token;
  value: number;

  constructor(token: Token) {
    this.token = token;
    this.value = parseInt(token.value);
  }
}

export class FloatValue {
  token: Token;
  value: number;

  constructor(token: Token) {
    this.token = token;
    this.value = parseFloat(token.value);
  }
}

export class EnumValue {
  token: Token;
  value: string;

  constructor(token: Token) {
    this.token = token;
    this.value = token.value;
  }
}

type Literal = StringValue | IntValue | FloatValue | EnumValue | ListValue | ObjectValue;
type Value = Literal | Variable;

export class ListValue {
  startToken: Token;
  endToken: Token;
  values?: Value[];
  
  constructor(startToken: Token, endToken: Token, values?: Value[]) {
    this.startToken = startToken;
    this.endToken = endToken;
    this.values = values;
  }
}

export class ObjectField {
  name: Identifier;
  value: Value;

  constructor(name: Identifier , value: Value) {
    this.name = name;
    this.value = value;
  }
}

export class ObjectValue {
  startToken: Token;
  endToken: Token;
  fields?: ObjectField[];

  constructor(startToken: Token, endToken: Token, fields?: ObjectField[]) {
    this.startToken = startToken;
    this.endToken = endToken;
    this.fields = fields;
  }
}

export class NamedType {
  name: Identifier;

  constructor(name: Identifier) {
    this.name = name;
  }
}

export class NonNullType {
  token: Token;
  type: NamedType | ListType;

  constructor(token: Token, type: NamedType | ListType) {
    this.token = token;
    this.type = type;
  }
}

type Type = NamedType | NonNullType | ListType;

export class ListType {
  startToken: Token;
  endToken: Token;
  type: Type;

  constructor(startToken: Token, endToken: Token, type: Type) {
    this.startToken = startToken;
    this.endToken = endToken;
    this.type = type;
  }
}

export class VariableDefinition {
  variable: Variable;
  type: Type;
  defaultValue: Literal;

  constructor(variable: Variable, type: Type, defaultValue: Literal) {
    this.variable = variable;
    this.type = type;
    this.defaultValue = defaultValue;
  }
}

export class Argument {
  name: Identifier;
  value: Value;

  constructor(name: Identifier, value: Value) {
    this.name = name;
    this.value = value;
  }
}

export class FragmentSpread {
  name: Identifier;

  constructor(name: Identifier) {
    this.name = name;
  }
}

type Selection = FragmentSpread | InlineFragment | Field;

export class InlineFragment {
  typeCondition: Identifier;
  selectionSet: Selection[];

  constructor(typeCondition: Identifier, selectionSet: Selection[]) {
    this.typeCondition = typeCondition;
    this.selectionSet = selectionSet;
  }
}

export class Field {
  alias?: Identifier;
  name: Identifier;
  args?: Argument[];
  selectionSet?: Selection[];

  constructor(name: Identifier, alias?: Identifier, args?: Argument[], selectionSet?: Selection[]) {
    this.name = name;
    this.alias = alias;
    this.args = args;
    this.selectionSet = selectionSet;
  }
}

export class FragmentDefinition {
  name: Identifier;
  typeCondition: Identifier;
  selectionSet: Selection[];

  constructor(name: Identifier, typeCondition: Identifier, selectionSet: Selection[]) {
    this.name = name;
    this.typeCondition = typeCondition;
    this.selectionSet = selectionSet;
  }
}

export class OperationDefintion {
  type?: Identifier;
  name?: Identifier;
  variableDefinitions?: VariableDefinition[];
  selectionSet: Selection[];

  constructor(selectionSet: Selection[], type?: Identifier, name?: Identifier, variableDefinitions?: VariableDefinition[]) {
    this.selectionSet = selectionSet;
    this.type = type;
    this.name = name;
    this.variableDefinitions = variableDefinitions;
  }
}

export class Document {
  operationDefinitions: OperationDefintion[];
  fragmentDefinitions?: FragmentDefinition[];

  constructor(operationDefinitions: OperationDefintion[], fragmentDefinitions?: FragmentDefinition[]) {
    this.operationDefinitions = operationDefinitions;
    this.fragmentDefinitions = fragmentDefinitions;
  }
}
