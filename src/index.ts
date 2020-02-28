// const matchToken = [

//   // string literal
//   '"(?:.|\\s)*?"',
//   // float literal
//   '(?:-)?\\d+(?:(?:\\.\\d+[eE][-+]?\\d+)|(?:\\.\\d+)|(?:[eE][-+]?\\d+))',
//   // int literal
//   '(?:-)?(?:0|[1-9]\\d*)',
//   // operation type identifier: 'query', 'mutation', 'subscription'
//   // fragment identifier: 'fragment'
//   // type condition identifier: 'on'
//   // definition identifier: 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'
//   // name identifier (operation, variable, type, alias, field, argument)
//   // boolean literal
//   // null literal
//   // enum value
//   '\\w+',
//   // '...' - spread operator
//   // '$' - variable identifier
//   // '!' - nonnull value identifier
//   // '@' - directive identifier
//   // ':', '=', '|'
//   // separator: '{', '}', '(', ')', '[', ']'
//   // ... invalid token
//   '(\\.{3})|([^\\s,])'
  
// ].map(exp => `(${exp})`).join('|');

// enum TokenKind {
//   StringLiteral = 1,
//   FloatLiteral,
//   IntLiteral,
//   Name,
//   Punctuator
// }

// class Token {
//   readonly value: string;
//   readonly kind: TokenKind;
//   readonly start: number;

//   constructor(value: string, kind: TokenKind, start: number) {
//     this.value = value;
//     this.kind = kind;
//     this.start = start;
//   }

//   get end(): number {
//     return this.start + this.value.length;
//   }
// }

// class Lexer {
//   readonly document: string;
//   private matchToken: RegExp;

//   constructor(document: string) {
//     this.document = document;
//     this.matchToken = new RegExp(matchToken, 'g');
//   }

//   nextToken(): Token {
//     const token = this.matchToken.exec(this.document);
//     const tokenKind = token.indexOf(token[0], 1);
//     return new Token(token[0], tokenKind, token.index);
//   }
// }

import { Tokenizer } from './tokenization';

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

class ArgumentNode {
  name;
  value;
}

class FieldNode {
  name;
  selections;
  fragments;
}

// const query = `
//   query operation($limit: Int! $offset: String) {
//     users: allUsers(limit: $limit offset: $offset arg1: 1 arg2: 2.3 arg3: "asd qwerty
//     zxcv" arg4: [1 "asd"] arg5: { a: 1 b: "asd" }): {
//       id
//       email
//       firstname: name
//       lastname: surname
//     }
//     totalUsers
//   }
// `;

const query = `
  all1Users(limit: -1 offset: -3.5e-5) {
    id
  }
`;

// const query = `{1a1: 1, b: "a fsd
// 12 &&"s $$
// 123 dfd"
//     $d
//     dd1: {
//       1a: 1.2
//     }
//   }
//   {a:5}`;

  const tokenizer = new Tokenizer(query);
  const res = tokenizer.nextToken();
  console.log(res);

  // const _matchToken = new RegExp(matchToken, 'g');
  // //const res = [...query.matchAll(_matchToken)].map(([val]) => val);
  // const res = _matchToken.exec(query);
  // console.log(res);

  //const res1 = query.match(matchToken);//.map(([val]) => val);
  // let res1 = matchToken.exec(query);
  // console.log(res1);
  // res1 = matchToken.exec(query);
  // console.log(res1);
  // res1 = matchToken.exec(query);
  // console.log(res1);
  
//"asd"

// const parser = new GraphQLParser(query);
// console.log(parser.findNextToken());
// console.log(parser.findNextToken());
