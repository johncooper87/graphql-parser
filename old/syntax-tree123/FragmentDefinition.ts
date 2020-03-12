import { ParsingContext } from '../Context';
import { SyntaxError } from '../SyntaxError';
import { TokenKind } from '../lexing';

export class FragmentDefinition {
  name: string;
  type: string;
  selectionSet: SelectionSet;

  static parse(this: ParsingContext): void {

    let token = this.lexer.read();
    if (token === null) throw new SyntaxError(`Identifier expected.`, token);
    if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);

    const name = token.value;
    if (this.document.fragmentDefinitions.has(name)) {
      this.pushError(`Duplicate identifier '${name}'.`, token);
    }

    token = this.lexer.read();
    if (token === null) throw new SyntaxError(`Type condition expected.`, token);
    if (token.value !== 'on') throw new SyntaxError(`Expected 'on', found ${token}.`);

    token = this.lexer.read();
    if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
    const type = token.value;
    //this.fragmentDefinitions.set(name, new FragmentDefinition(name, lexer));
  }
}