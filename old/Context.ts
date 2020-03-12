import { SemanticError } from './SemanticError';
import { Lexer, Token } from "./lexing";
import { Document, FragmentDefinition, Operation } from './syntax-tree';

export class Context {

  lexer: Lexer;
  private errors: SemanticError[] = [];
  document: Document;

  rootNode: any;
  
  parseDocument: typeof Document.parse = Document.parse.bind(this);
  parseFragmentDefinition: typeof FragmentDefinition.parse = FragmentDefinition.parse.bind(this);
  parseOperation: typeof Operation.parse = Operation.parse.bind(this);
  //parse: typeof .parse = .parse.bind(this);
  
  constructor(source: string) {
    this.lexer = new Lexer(source);
    //this.pushError = this.pushError.bind(this);
  }

  pushError(message: string, token: Token) {
    this.errors.push(new SemanticError(message, token));
  }
}