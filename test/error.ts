import { Lexer, Token } from '../src/lexing';
import SyntaxError from '../src/SyntaxError';

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
throw new SyntaxError('Unexpected token', token);