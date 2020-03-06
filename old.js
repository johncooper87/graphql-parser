
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