import { Token } from "./lexing";

export class SyntaxError extends Error {
  constructor(message: string, token?: Token) {
    const { value, source, line, lineOffset, column } = token;

    if (token === undefined) super(message);
    else {
      let nextLineOffset: number;
      if (token === null) nextLineOffset = source.length;
      else {
        const scanner = /\r?\n/g;
        scanner.lastIndex = lineOffset + column + value.length;
        nextLineOffset = scanner.exec(source)?.index || source.length;
      }

      super(
        message + ` (line ${line}, column ${column})\n`
        + source.slice(0, nextLineOffset)
        + '\n'
        + ' '.repeat((column || 1) - 1) + '^'.repeat(value.length)
        + source.slice(nextLineOffset)
      );
    }

    this.name = 'SyntaxError';
  }
}