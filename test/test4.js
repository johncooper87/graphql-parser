class Test {
  get() {
    return this.value;
  }
  
  constructor(value, kind) {
    this.value = value;
    this.kind = kind;
  }
}

const test = new Test("asd", 1);

console.log(test);
console.log(test.kind);