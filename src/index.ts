const matchToken = [

  /"(?:.|\s)*?"/,   // string literal
  /(?:-)?\d+\.\d+/, // float literal
  /(?:-)?\d+/,      // int literal
  /\.{3}/,          // include fragment operator
  /\w+/,            // name identifier or keyword ('fragment' or 'on')
  /[^\s,]/          // enclosing tokens: '{', '}', '(', ')', '[', ']'; variable identifier - '$'; identifier of required variable - '!'; invalid tokens: ...
  
].map(exp => `(${exp.source})`).join('|');

function parse(document: string) {

  const _matchTokens = new RegExp(matchToken, 'g');
  const nextToken = () => _matchTokens.exec(document);


}

class GraphQLParser {
  source: string;
  matchToken: RegExp;

  constructor(source: string) {
    this.source = source;
    this.matchToken = new RegExp(matchToken, 'g');
  }

  findNextToken() {
    return this.matchToken.exec(this.source);
  }
}

class ASTNode {
  value;
}

class Token {
  value;
  start;

  constructor(value, start) {
    this.value = value;
    this.start = start;
  }

  get end() {
    return this.start + this.value.length;
  }
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
  all1Users(limit: -1 offset: -3.5) {
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

  const _matchToken = new RegExp(matchToken, 'g');
  const res = [...query.matchAll(_matchToken)].map(([val]) => val);
  //const res = matchToken.exec(query);
  console.log(res);

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
