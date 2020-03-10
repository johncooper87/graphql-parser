
// 1. Keywords:
// 1.1. Operation types: 'query', 'mutation', 'subscription';
// 1.2. Fragment indicator - 'fragment'; type condition - 'on';
// 1.3. Boolean literals: 'true' or 'false';
// 1.4. Null value literal - 'null';
// 2. Identifier of: operation, variable, type, alias, field, argument, enum element;

// '=', ':'
// '...' - spread operator
// '!' - nonnull value indicator
// '@' - directive indicator
// '$' - variable indicator
// separator: '(', ')', '{', '}', '[', ']'

// DEPRECATED:
// 'schema', 'extend', 'interface', 'type', 'implements', 'union', 'enum', 'directive'
// '|'



    // switch (this.kind) {
    //   case 1:
    //     return `string: ${this.value.replace(/\r?\n/g, '\\n')}`;
    //   case 2:
    //     return `int: ${this.value}`;
    //   case 3:
    //     return `float: ${this.value}`;
    //   default:
    //     return `'${this.value}'`;
    // }


    // let kind: TokenKind;
    // if (name !== undefined) kind = TokenKind.Name;
    // else if (punctuator !== undefined) kind = TokenKind.Punctuator;
    // // If the lexeme has the integer part then it is at least a numeric literal
    // else if (integerPart !== undefined) {
    //   // If the lexeme does not have the fractional part or exponential notation
    //   // then it is an integer literal, otherwise it is a floating-point literal
    //   kind = fractionalPart === undefined && eNotation === undefined ? TokenKind.IntLiteral : TokenKind.FloatLiteral;
    // }
    // else if (stringLiteral !== undefined) kind = TokenKind.StringLiteral;
    // else if (invalid !== undefined) {
    //   //handle invalid
    // }


    //const MAX_LINE_LENGTH = 30;


    //const lineLength = nextLineOffset - lineOffset;

    // let lineStart: number,
    //   tokenOffset: number,
    //   lineEnd: number;
    // if (lineLength <= MAX_LINE_LENGTH) {
    //   lineStart = lineOffset;
    //   tokenOffset = column - 1;
    //   lineEnd = nextLineOffset;
    // } else if (value.length >= MAX_LINE_LENGTH) {
    //   lineStart = lineOffset + column;
    //   tokenOffset = 0;
    //   lineEnd = lineStart + MAX_LINE_LENGTH;
    // } else {
    //   tokenOffset = lineLength - MAX_LINE_LENGTH + column;
    //   const maxOffset = Math.floor((MAX_LINE_LENGTH - value.length) / 2);
    //   tokenOffset = tokenOffset > maxOffset ? maxOffset : tokenOffset;
    //   tokenOffset =- 1;
    //   lineStart = lineOffset + tokenOffset - column;
    //   lineEnd = lineStart + MAX_LINE_LENGTH;
    // }














    // enum LiteralKind {
    //     String,
    //     Float,
    //     Int,
    //     Boolean,
    //     EnumValue,
    //     Null
    //   }
      
    //   class Literal {
    //     kind: LiteralKind;
    //     value: string | number | boolean | null;
    //   }
      
    //   enum ValueKind {
    //     Literal,
    //     InputObject,
    //     List
    //   }
      
    //   type ValueType = Literal | object | ValueType[];
      
    //   class Value {
    //     kind: ValueKind;
    //     value: ValueType
    //   }
      
    //   // class InputObject {
      
    //   // }
      
    //   // class List {
    //   //   values: (Literal | InputObject | List)[];
    //   // }
      
    //   class Type {
    //     name: string;
    //     nonNull: boolean = false;
    //   }
      
    //   class Variable {
    //     type;
    //     defaultValue;
    //   }
      
    //   class Argument {
    //     name: string;
    //     value: Value | Variable;
    //   }
      
    //   class Field {
    //     alias: string;
    //     name: string;
    //     selectionSet?: SelectionSet;
    //   }
      
    //   class InlineFragment {
    //     typeCondition: string;
    //     selectionSet: SelectionSet;
    //   }
      
    //   class Fragment {
    //     name: string;
    //     typeCondition: string;
    //     selectionSet: SelectionSet;
      
    //     constructor(tokenizer: Lexer) {
    //       this.name = tokenizer.lastToken.value;
      
    //       let token = tokenizer.nextToken();
    //       if (token === null) tokenizer.emitError(`Expected type condition`);
    //       if (token.kind !== TokenKind.Name && token.value !== 'on') tokenizer.emitError(`Expected 'on', found ${token}`);
    //     }
    //   }
      
    //   //type Selection = Field | Fragment | InlineFragment;
    //   //type SelectionSet = Selection[];
      
    //   class SelectionSet {
    //     fields: Map<string, Field>;
    //     fragments: Map<string, Fragment>;
    //     inlineFragments: Map<string, Field>;
    //   }
      
    //   enum OperationType {
    //     Query,
    //     Mutation,
    //     Subscription
    //   }
      
    //   class Operation {
    //     type: OperationType;
    //     name?: string;
    //     variableDeclarations: Map<string, Variable>;
    //     selectionSet: SelectionSet;
      
    //     constructor(tokenizer: Lexer) {
          
    //     }
    //   }
      
      
      
    //   class Document {
    //     operations: Map<string, Operation>  = new Map();
    //     fragmentDefinitions: Map<string, Fragment> = new Map();
      
    //     constructor(lexer: Lexer) {
    //       let token = lexer.nextToken();
    //       while (token !== null) {
            
    //         if (token.kind === TokenKind.Name) {
      
    //           if (token.value === 'fragment') {
    //             token = lexer.nextToken();
    //             if (token === null) throw new ParseError(`Expected identifier`, token);
    //             if (token.kind !== TokenKind.Name) throw new ParseError(`Unexpected ${token}`, token);
    //             if (this.fragmentDefinitions.has(token.value)) throw new ParseError(`Duplicate identifier '${token.value}'`, token);
    //             this.fragmentDefinitions.set(token.value, new Fragment(lexer));
    //           }
      
    //           if (token.value === 'query' || token.value === 'mutation' || token.value === 'subscription') {
    //             //const operationType = token.value;
    //             token = lexer.nextToken();
    //             if (token.kind !== TokenKind.Name) {
      
    //               if (this.operations.has(token.value)) lexer.emitError(`Duplicate identifier '${token.value}'`);
    //               this.operations.set(token.value, new Operation(lexer));
      
    //             } else if (token.value === '{') {
      
    //               if (this.operations.has(undefined)) lexer.emitError(`Only one anonymous operation allowed`);
    //               this.operations.set(token.value, new Operation(lexer));
      
    //             } else {
    //               lexer.emitError(`Expected '{', found ${token}`);
    //             }
      
    //           } else {
    //             lexer.emitError(`Unexpected token '${token.value}'`);
    //           }
      
    //         } if (token.value === '{') {
      
    //           if (this.operations.has(undefined)) lexer.emitError(`Only one anonymous operation allowed`);
    //           this.operations.set(token.value, new Operation(lexer));
              
    //         }
    //         else {
    //           lexer.emitError(`Unexpected token '${token.value}'`);
    //         }
    //         //
      
      
            
    //       }
    //     }
    //   }