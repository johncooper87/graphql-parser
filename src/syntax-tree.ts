import { Lexer, TokenKind, Token } from "./lexing";
import ParseError from './ParseError';
import Context from './parse';

class SelectionSet {
  fields: Map<string, Field>;
  fragments: Map<string, Fragment>;
  inlineFragments: Map<string, Field>;

  static parse(lexer: Lexer, document: Document) {
    
  }
}

export class FragmentDefinition {
  name: string;
  type: string;
  selectionSet: SelectionSet;

  static parse(context: Context, document: Document) {
    const { lexer, pushError } = context;

    let token = lexer.read();
    if (token === null) throw new ParseError(`Identifier expected.`, token);
    if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);

    const name = token.value;
    if (document.fragmentDefinitions.has(name)) {
      pushError(new ParseError(`Duplicate identifier '${name}'.`, token));
    }

    token = lexer.read();
    if (token === null) throw new ParseError(`Type condition expected.`, token);
    if (token.value !== 'on') throw new ParseError(`Expected 'on', found ${token}.`);

    token = lexer.read();
    if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);
    const type = token.value;
    //this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
  }
}

export class Operation {
  type: string;
  name?: string;
  variableDeclarations: Map<string, Variable>;
  selectionSet: SelectionSet;

  static parse(context: Context, document: Document, operationType: string, nameToken?: Token) {
    const { lexer, pushError } = context;

    if (nameToken === undefined) {

      const token = context.lexer.read();
      if (token.kind === TokenKind.Name) Operation.parse(context, document, operationType, token);
      else if (token.value === '{') Operation.parse(context, document, operationType, null);
      else throw new ParseError(`Expected '{', found ${token}.`, token);

    } else {

      const name = nameToken?.value;
      if (document.operations.has(name)) {
        if (name === null) throw new ParseError(`Only one anonymous operation allowed.`);
        throw new ParseError(`Duplicate identifier '${name}'.`, nameToken);
      }
      //this.operations.set(name, new Operation(operationType, name, lexer));

    }
  }
}

export class Document {
  fragmentDefinitions: Map<string, FragmentDefinition> = new Map();
  operations: Map<string, Operation> = new Map();

  static parse(context: Context) {
    const { lexer } = context;

    const document = new Document();
    let token = lexer.read();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') FragmentDefinition.parse(context, document);

        if (token.value !== 'query'
          && token.value !== 'mutation'
          && token.value !== 'subscription'
        ) throw new ParseError(`Unexpected ${token}.`, token);
        Operation.parse(context, document, token.value);

      } else if (token.value === '{') Operation.parse(context, document, 'query', null);
      else throw new ParseError(`Unexpected '${token}'.`, token);

    }
  }
}

export class FragmentSpread {
  name: string;
  definition: FragmentDefinition;
}





// import { Lexer, TokenKind, Token } from "./lexing";
// import ParseError from './ParseError';

// class SelectionSet {
//   fields: Map<string, Field>;
//   fragments: Map<string, Fragment>;
//   inlineFragments: Map<string, Field>;

//   static parse(lexer: Lexer, document: Document) {
    
//   }
// }

// export class FragmentDefinition {
//   name: string;
//   type: string;
//   selectionSet: SelectionSet;

//   static parse(lexer: Lexer, document: Document) {
//     let token = lexer.read();
//     if (token === null) throw new ParseError(`Identifier expected.`, token);
//     if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);

//     const name = token.value;
//     if (document.fragmentDefinitions.has(name)) throw new ParseError(`Duplicate identifier '${name}'.`, token);

//     token = lexer.read();
//     if (token === null) throw new ParseError(`Type condition expected.`, token);
//     if (token.value !== 'on') throw new ParseError(`Expected 'on', found ${token}.`);

//     token = lexer.read();
//     if (token.kind !== TokenKind.Name) throw new ParseError(`Expected name, found ${token}.`, token);
//     const type = token.value;
//     //this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
//   }
// }

// export class Operation {
//   type: string;
//   name?: string;
//   variableDeclarations: Map<string, Variable>;
//   selectionSet: SelectionSet;

//   static parse(lexer: Lexer, document: Document, operationType: string, nameToken?: Token) {
//     if (nameToken === undefined) {

//       const token = lexer.read();
//       if (token.kind === TokenKind.Name) Operation.parse(lexer, document, operationType, token);
//       else if (token.value === '{') Operation.parse(lexer, document, operationType, null);
//       else throw new ParseError(`Expected '{', found ${token}.`, token);

//   } else {

//     const name = nameToken?.value;
//     if (document.operations.has(name)) {
//       if (name === null) throw new ParseError(`Only one anonymous operation allowed.`);
//       throw new ParseError(`Duplicate identifier '${name}'.`, nameToken);
//     }
//     //this.operations.set(name, new Operation(operationType, name, lexer));

//   }
//   }
// }

// export class Document {
//   fragmentDefinitions: Map<string, FragmentDefinition> = new Map();
//   operations: Map<string, Operation> = new Map();

//   static parse(lexer: Lexer) {
//     const document = new Document();
//     let token = lexer.read();
//     while (token !== null) {
      
//       if (token.kind === TokenKind.Name) {

//         if (token.value === 'fragment') FragmentDefinition.parse(lexer, document);

//         if (token.value !== 'query'
//           && token.value !== 'mutation'
//           && token.value !== 'subscription'
//         ) throw new ParseError(`Unexpected ${token}.`, token);
//         Operation.parse(lexer, document, token.value);

//       } else if (token.value === '{') Operation.parse(lexer, document, 'query', null);
//       else throw new ParseError(`Unexpected '${token}'.`, token);

//     }
//   }
// }

// export class FragmentSpread {
//   name: string;
//   definition: FragmentDefinition;
// }



