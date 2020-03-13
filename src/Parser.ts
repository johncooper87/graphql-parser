import  { SyntaxError } from './SyntaxError';
import  { SemanticError } from './SemanticError';
import { Lexer, Token, TokenKind } from "./lexing";
import { Document, FragmentDefinition, Operation, SelectionSet, FieldSelection, Argument } from './syntax-tree';

export class Parser {

  private lexer: Lexer;
  private errors: SemanticError[] = []
  private document: Document;
  private rootNode: any;

  constructor(source: string) {
    this.lexer = new Lexer(source);
  }

  private pushError(message: string, token: Token) {
    this.errors.push(new SemanticError(message, token));
  }

  parseDocument(): void {

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

  private parseFragmentDefinition(): void {

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

  private parseOperation(operationType: string, nameToken?: Token): void {

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

  private parseSelectionSet(): SelectionSet {
    //let token = this.lexer.read();
    //if (token.value !== '{') throw new SyntaxError(`Expected 'on', found ${token}.`);

    let token = this.lexer.read();

    const selectionSet: SelectionSet = [];

    const fieldTokens: Map<string, [FieldSelection, Token]> = new Map();
    const fragments: Map<string, string> = new Map();

    while (token.value !== '}') {
      if (token.kind === TokenKind.Name) {

        const fieldSelection = this.parseFieldSelection(token.value);

        const { name } = fieldSelection;
        if (fieldNodes.has(name)) {
          // compare arguments
          // merge selection set
        } else fieldNodes.set(name, [fieldSelection, token]);

        selectionSet.push(fieldSelection);
      }
      else if (token.value === '...') {
        //this.parseFragmentSpread();
      }
      else throw new SyntaxError(`Unexpected ${token}.`, token);
    }

    return selectionSet;

  }

  private parseFieldSelection(identifier: string): FieldSelection {
    let name: string,
      alias: string,
      selectionSet: SelectionSet;

    let token = this.lexer.read();
    if (token.value === ':') {

      token = this.lexer.read();
      if (token.kind !== TokenKind.Name) throw new SyntaxError(`Expected name, found ${token}.`, token);
      name = token.value;
      alias = identifier;
      token = this.lexer.read();
    }
    else name = identifier;

    //if (token.value === '(')
    // parse arguments

    if (token.value === '{') selectionSet = this.parseSelectionSet();

    return new FieldSelection(name, alias, selectionSet);
  }

  private parseFragmentSpread(selectionSet: SelectionSet) {

  }


}