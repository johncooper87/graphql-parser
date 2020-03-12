export class FieldSelection {
  alias?: string;
  name: string;
  selectionSet?: SelectionSet;

  constructor(name: string, alias?: string, selectionSet?: SelectionSet) {
    this.name = name;
    this.alias = alias;
    this.selectionSet = selectionSet;
  }
}

export type SelectionSet = (FieldSelection | FragmentSpread | InlineFragment)[]; 

// export class SelectionSet {
//   fields: Map<string, FieldSelection>;
//   fragments: Map<string, FragmentSpread>;
//   inlineFragments: Map<string, SelectionSet>;

//   pushField(fieldSelection: FieldSelection) {

//   }
// }

export class InlineFragment {
  type: string;
  selectionSet: SelectionSet;
}

export class FragmentDefinition {
  name: string;
  type: string;
  selectionSet: SelectionSet;
}

export class Operation {
  type: string;
  name?: string;
  variableDeclarations: Map<string, Variable>;
  selectionSet: SelectionSet;
}

export class Document {
  fragmentDefinitions: Map<string, FragmentDefinition> = new Map();
  operations: Map<string, Operation> = new Map();
}

export class FragmentSpread {
  name: string;
  definition: FragmentDefinition;
}