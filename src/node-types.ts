import { Tokenizer, TokenKind } from "./tokenization";

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
  selectionSet?: SelectionSet;
}

class InlineFragment {
  typeCondition: string;
  selectionSet: SelectionSet;
}

class Fragment {
  name: string;
  typeCondition: string;
  selectionSet: SelectionSet;

  constructor(tokenizer: Tokenizer) {
    this.name = tokenizer.lastToken.value;

    let token = tokenizer.nextToken();
    if (token === null) tokenizer.emitError(`Expected type condition`);
    if (token.kind !== TokenKind.Name && token.value !== 'on') tokenizer.emitError(`Expected 'on', found ${token}`);
  }
}

//type Selection = Field | Fragment | InlineFragment;
//type SelectionSet = Selection[];

class SelectionSet {
  fields: Map<string, Field>;
  fragments: Map<string, Fragment>;
  inlineFragments: Map<string, Field>;
}

enum OperationType {
  Query,
  Mutation,
  Subscription
}

class Operation {
  type: OperationType;
  name?: string;
  variableDeclarations: Map<string, Variable>;
  selectionSet: SelectionSet;

  constructor(tokenizer: Tokenizer) {
    
  }
}



class Document {
  operations: Map<string, Operation>  = new Map();
  fragmentDefinitions: Map<string, Fragment> = new Map();

  constructor(tokenizer: Tokenizer) {
    let token = tokenizer.nextToken();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') {
          token = tokenizer.nextToken();
          if (token === null) tokenizer.emitError(`Expected identifier`);
          if (token.kind !== TokenKind.Name) tokenizer.emitError(`Expected name, found ${token}`);
          if (this.fragmentDefinitions.has(token.value)) tokenizer.emitError(`Duplicate identifier '${token.value}'`);
          this.fragmentDefinitions.set(token.value, new Fragment(tokenizer));
        }

        if (token.value === 'query' || token.value === 'mutation' || token.value === 'subscription') {
          //const operationType = token.value;
          token = tokenizer.nextToken();
          if (token.kind !== TokenKind.Name) {

            if (this.operations.has(token.value)) tokenizer.emitError(`Duplicate identifier '${token.value}'`);
            this.operations.set(token.value, new Operation(tokenizer));

          } else if (token.value === '{') {

            if (this.operations.has(undefined)) tokenizer.emitError(`Only one anonymous operation allowed`);
            this.operations.set(token.value, new Operation(tokenizer));

          } else {
            tokenizer.emitError(`Expected '{', found ${token}`);
          }

        } else {
          tokenizer.emitError(`Unexpected token '${token.value}'`);
        }

      } if (token.value === '{') {

        if (this.operations.has(undefined)) tokenizer.emitError(`Only one anonymous operation allowed`);
        this.operations.set(token.value, new Operation(tokenizer));
        
      }
      else {
        tokenizer.emitError(`Unexpected token '${token.value}'`);
      }
      //


      
    }
  }
}