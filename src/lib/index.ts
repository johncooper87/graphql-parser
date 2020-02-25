// const matchToken = /".+"|\d+|\d+\.\d+|\w+|[^\s,]/g;
//const matchToken = /(?<string>"(?:.|\s)*?")|(?<float>\d+\.\d+)|(?<int>\d+)|(?<name>(?:\$)?\w+)|(?<other>[^\s,])/g;

// const matchToken = new RegExp(

//   [
//     //string literal
//     /"(?:.|\s)*?"/,
//     //float literal
//     /\d+\.\d+/,
//     //int literal
//     /\d+/,

//     /\.{3}/,
//     /on/,
//     /fragment/,

//     /true/,
//     /false/,

//     //name
//     /(?:\$)?\w+/,
//     //other
//     /[^\s,]/
//   ].map(value => {
//     const str = value.toString();
//     return `(${str.substr(1, str.length - 2)})`;
//   }).join('|'),

// 'g');

const matchToken = new RegExp(

  [
    /"(?:.|\s)*?"/,
    /\d+\.\d+/,
    /\d+/,
    /\.{3}/,
    /\w+/,
    /[^\s,]/
  ].map(value => {
    const str = value.toString();
    return `(${str.substr(1, str.length - 2)})`;
  }).join('|'),

'g');

console.log(matchToken);

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

const query = `
  query operation($limit: Int! $offset: String) {
    users: allUsers(limit: $limit offset: $offset arg1: 1 arg2: 2.3 arg3: "asd qwerty
    zxcv" arg4: [1 "asd"] arg5: { a: 1 b: "asd" }): {
      id
      email
      firstname: name
      lastname: surname
    }
    totalUsers
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

  // const res = [...query.matchAll(matchToken)];//.map(([val]) => val);
  // //const res = matchToken.exec(query);
  // console.log(res);

  //const res1 = query.match(matchToken);//.map(([val]) => val);
  let res1 = matchToken.exec(query);
  console.log(res1);
  res1 = matchToken.exec(query);
  console.log(res1);
  res1 = matchToken.exec(query);
  console.log(res1);
  
"asd"
