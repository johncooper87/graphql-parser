import { Context } from '../Context';
import { SyntaxError } from '../SyntaxError';
import { TokenKind } from '../lexing';
import { FragmentDefinition, Operation } from './';

export class Document {
  fragmentDefinitions: Map<string, FragmentDefinition> = new Map();
  operations: Map<string, Operation> = new Map();

  static parse(this: Context): void {

    this.document = new Document();
    let token = this.lexer.read();
    while (token !== null) {
      
      if (token.kind === TokenKind.Name) {

        if (token.value === 'fragment') this.parseFragmentDefinition();

        if (token.value !== 'query'
          && token.value !== 'mutation'
          && token.value !== 'subscription'
        ) throw new SyntaxError(`Unexpected ${token}.`, token);
        this.parseOperation(token.value);

      } else if (token.value === '{') this.parseOperation('query', null);
      else throw new SyntaxError(`Unexpected '${token}'.`, token);

    }
  }
}