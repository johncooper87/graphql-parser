import { Lexer, TokenKind } from "./lexing";
import ParseError from './ParseError';

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


class Parser {
  operations: Map<string, Operation> = new Map();
  fragmentDefinitions: Map<string, FragmentDefinition> = new Map();

  

  constructor(lexer: Lexer) {
    const lexer = new Lexer(query);
    let token = lexer.nextToken();

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