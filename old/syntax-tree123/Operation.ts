import { ParsingContext } from '../Context';
import { SyntaxError } from '../SyntaxError';
import { Token, TokenKind } from '../lexing';

export class Operation {
  type: string;
  name?: string;
  variableDeclarations: Map<string, Variable>;
  selectionSet: SelectionSet;

  static parse(this: ParsingContext, operationType: string, nameToken?: Token): void {

    if (nameToken === undefined) {

      const token = this.lexer.read();
      if (token.kind === TokenKind.Name) this.parseOperation(operationType, token);
      else if (token.value === '{') this.parseOperation(operationType, null);
      else throw new SyntaxError(`Expected '{', found ${token}.`, token);

    } else {

      const name = nameToken?.value;
      if (this.document.operations.has(name)) {
        if (name === null) throw new SyntaxError(`Only one anonymous operation allowed.`);
        this.pushError(`Duplicate identifier '${name}'.`, nameToken);
      }
      //this.operations.set(name, new Operation(operationType, name, lexer));

    }
  }
}