import { Token } from './lexing';

class SyntaxNode {
  token: Token;
  constructor(token: Token) {
    this.token = token;
  }
}

export class Identifier extends SyntaxNode {
  value: string;
  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}

export class Variable extends SyntaxNode {
  name: Identifier;
  constructor(token: Token, name: Identifier) {
    super(token);
    this.name = name;
  }
}

export class StringValue extends SyntaxNode {
  value: string;
  constructor(token: Token) {
    super(token);
    this.value = token.value.slice(1, -1);
  }
}

export class IntValue extends SyntaxNode {
  value: number;
  constructor(token: Token) {
    super(token);
    this.value = parseInt(token.value);
  }
}

export class FloatValue extends SyntaxNode {
  value: number;
  constructor(token: Token) {
    super(token);
    this.value = parseFloat(token.value);
  }
}

export class EnumValue extends SyntaxNode {
  value: string;
  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}

type Literal = StringValue | IntValue | FloatValue | EnumValue | ListValue | ObjectValue;
type Value = Literal | Variable;

export class ListValue {
  values: Value[];
  constructor(values: Value[]) {
    this.values = values;
  }
}

export class ObjectField {
  name: Identifier;
  value: Value;
  constructor(value: Value) {
    this.value = value;
  }
}

export class ObjectValue {
  fields?: ObjectField[];
  constructor(fields?: ObjectField[]) {
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
  type: NamedType | ListType;
  constructor(type: NamedType | ListType) {
    this.type = type;
  }
}

export class ListType {
  type: Type;
  constructor(type: Type) {
    this.type = type;
  }
}

type Type = NamedType | NonNullType | ListType;

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

export class FieldSelection {
  alias?: Identifier;
  name: Identifier;
  args?: Argument[];
  selectionSet?: SelectionSet;
  constructor(name: Identifier, alias?: Identifier, args?: Argument[], selectionSet?: SelectionSet) {
    this.name = name;
    this.alias = alias;
    this.args = args;
    this.selectionSet = selectionSet;
  }
}

export class FragmentSpread {
  name: Identifier;
  constructor(name: Identifier) {
    this.name = name;
  }
}

export class InlineFragment {
  name: Identifier;
  selectionSet: SelectionSet;
  constructor(name: Identifier, selectionSet: SelectionSet) {
    this.name = name;
    this.selectionSet = selectionSet;
  }
}

export type SelectionSet = (FieldSelection | FragmentSpread | InlineFragment)[]; 

export class FragmentDefinition {
  name: Identifier;
  typeCondition: Identifier;
  selectionSet: SelectionSet;
  constructor(name: Identifier, typeCondition: Identifier, selectionSet: SelectionSet) {
    this.name = name;
    this.typeCondition = typeCondition;
    this.selectionSet = selectionSet;
  }
}

export class OperationDefintion {
  type?: Identifier;
  name?: Identifier;
  variableDefinitions?: VariableDefinition[];
  selectionSet: SelectionSet;
  constructor(selectionSet: SelectionSet, type?: Identifier, name?: Identifier, variableDefinitions?: VariableDefinition[]) {
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
