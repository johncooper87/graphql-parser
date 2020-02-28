class ASTNode {
  value;
}

class NameNode extends ASTNode {
  value;
  alias;
}

class LiteralNode {
  type;
  value;
}

enum LiteralKind {
  String,
  Float,
  Int,
  Boolean,
  EnumValue,
  Null
}

class Literal {
  kind: LiteralKind;
  value: string | number | boolean | null;
}

enum ValueKind {
  Literal,
  InputObject,
  List
}

type ValueType = Literal | object | ValueType[];

class Value {
  kind: ValueKind;
  value: ValueType
}

// class InputObject {

// }

// class List {
//   values: (Literal | InputObject | List)[];
// }

class Type {
  name: string;
  nonNull: boolean = false;
}

class Variable {
  type;
  defaultValue;
}

class Argument {
  name: string;
  value: Value | Variable;
}

class Field {
  alias: string;
  name: string;
  selectionSet?: Selection[];
}

class InlineFragment {
  typeCondition: string;
  selectionSet: Field[];
}

class Fragment {
  name: string;
  typeCondition: string;
  selectionSet: Field[];
}

type Selection = Field | InlineFragment[] | Fragment;
type SelectionSet = Map<string, Selection>;

class SelectionSet {
  fields: 
}

enum OperationType {
  Query,
  Mutation,
  Subscription
}

class Operation {
  type: OperationType;
  name?: string;
  variableDeclarations?: Map<string, Variable>;
  selectionSet: Selection[];
}

class Document {
  operations: Map<string, Operation>;
  fragmentDeclaration?: Map<string, Fragment>;
}