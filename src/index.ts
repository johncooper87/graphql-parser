import { Tokenizer } from './tokenization';

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
  all1Users(limit: -1 offset: -3.5e-5 asd: "asd \\"sadsad
  asasdsad 
  asdasdasdd") {
    id
    ... asd
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
  let res = tokenizer.nextToken();
  while (res !== null) {
    console.log(res.kind);
    console.log(`!!! ${res} !!!`);
    res = tokenizer.nextToken();
  }
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
