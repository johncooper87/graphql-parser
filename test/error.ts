import { Lexer, Token } from '../src/lexing';
import ParseError from '../src/ParseError';

const query = `
  query "asd" / asd "operation($limit: Int) {
    users {
      firstname
      lastname
      email
    }
  }
`;

const lexer = new Lexer(query);
let token: Token;
for (let i = 0; i < 12; i++) {
  token = lexer.read();
}
throw new ParseError('Unexpected token', token);