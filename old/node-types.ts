import { Lexer, TokenKind } from "./lexing";
import ParseError from './ParseError';

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

  constructor(tokenizer: Lexer) {
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
  type: string;
  name?: string;
  variableDeclarations: Map<string, Variable>;
  selectionSet: SelectionSet;

  constructor(type: string, name: string, lexer: Lexer) {
    this.type = type;
    this.name = name;

    //
  }
}

class FragmentSpread {
  name: string;
  definition: FragmentDefinition;
}

class FragmentDefinition {
  name: string;
  typeCondition: string;
  selectionSet: SelectionSet;

  constructor(name: string, lexer: Lexer) {
    this.name = name;

    let token = lexer.nextToken();
    if (token === null) throw new ParseError(`Type condition expected.`, token);
    if (token.value !== 'on') throw new ParseError(`Expected 'on', found ${token}.`);
  }
}

class Document {
  operations: Map<string, Operation> = new Map();
  fragmentDefinitions: Map<string, FragmentDefinition> = new Map();

  constructor(lexer: Lexer) {
    let token = lexer.nextToken();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') {
          token = lexer.nextToken();
          if (token === null) throw new ParseError(`Identifier expected.`, token);
          if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);

          const name = token.value;
          if (this.fragmentDefinitions.has(name)) throw new ParseError(`Duplicate identifier '${name}'.`, token);
          this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
        }

        if (token.value === 'query' || token.value === 'mutation' || token.value === 'subscription') {
          const operationType = token.value;
          token = lexer.nextToken();
          if (token.kind !== TokenKind.Name) {

            const name = token.value;
            if (this.operations.has(name)) throw new ParseError(`Duplicate identifier '${name}'.`, token);
            this.operations.set(name, new Operation(operationType, name, lexer));

          } else if (token.value === '{') {

            if (this.operations.has(null)) throw new ParseError(`Only one anonymous operation allowed.`);
            this.operations.set(null, new Operation(operationType, null, lexer));

          } else throw new ParseError(`Expected '{', found ${token}.`, token);

        } else throw new ParseError(`Unexpected ${token}.`, token);

      } if (token.value === '{') {

        if (this.operations.has(null)) throw new ParseError(`Only one anonymous operation allowed.`);
        this.operations.set(null, new Operation('query', null, lexer));
        
      }
      else {
        throw new ParseError(`Unexpected '${token}'.`, token);
      }

    }
  }
}


// if (this.fragmentDefinitions.has(token.value)) throw new ParseError(`Duplicate identifier '${token.value}'`, token);
// this.fragmentDefinitions.set(token.value, new Fragment(lexer));