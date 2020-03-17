import { Token } from '../lexing';

class Enclosing {
  start: Token;
  end: Token;

  constructor(start: Token, end: Token) {
    this.start = start;
    this.end = end;
  }
}

type Location = Token | Enclosing;

abstract class LocalizedNode {
  location: Location;

  constructor(location: Location) {
    this.location = location;
  }
}

abstract class Name extends LocalizedNode {
  name: string;

  constructor(token: Token) {
    super(token);
    this.name = token.value;
  }
}

export class Identifier extends LocalizedNode {
  value: string;

  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}

export class Variable extends LocalizedNode {
  name: Identifier;

  constructor(token: Token, name: Identifier) {
    super(token);
    this.name = name;
  }
}

export class StringValue extends LocalizedNode {
  value: string;

  constructor(token: Token) {
    super(token);
    this.value = token.value.slice(1, -1);
  }
}

export class IntValue extends LocalizedNode {
  value: number;

  constructor(token: Token) {
    super(token);
    this.value = parseInt(token.value);
  }
}

export class FloatValue extends LocalizedNode {
  value: number;

  constructor(token: Token) {
    super(token);
    this.value = parseFloat(token.value);
  }
}

export class EnumValue extends LocalizedNode {
  value: string;
  
  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}

type Literal = StringValue | IntValue | FloatValue | EnumValue | ListValue | ObjectValue;
type Value = Literal | Variable;

export class ListValue extends LocalizedNode {
  values?: Value[];

  constructor(location: Enclosing, values?: Value[]) {
    super(location);
    this.values = values;
  }
}

export class ObjectField {
  name: Identifier;
  value: Value;

  constructor(name: Identifier, value: Value) {
    this.name = name;
    this.value = value;
  }
}

export class ObjectValue extends LocalizedNode {
  fields?: ObjectField[];

  constructor(location: Enclosing, fields?: ObjectField[]) {
    super(location);
    this.fields = fields;
  }
}

// export class NamedType {
//   name: Identifier;

//   constructor(name: Identifier) {
//     this.name = name;
//   }
// }
export class NamedType extends Name {}

export class NonNullType extends LocalizedNode {
  type: NamedType | ListType;

  constructor(location: Token, type: NamedType | ListType) {
    super(location);
    this.type = type;
  }
}

type Type = NamedType | NonNullType | ListType;

export class ListType extends LocalizedNode {
  type: Type;

  constructor(location: Enclosing, type: Type) {
    super(location);
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

// export class FragmentSpread {
//   name: Identifier;
//
//   constructor(name: Identifier) {
//     this.name = name;
//   }
// }
export class FragmentSpread extends Name {}

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
