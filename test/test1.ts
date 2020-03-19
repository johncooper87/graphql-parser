export class A {
  a: number;

  constructor() {
    this.a = 5;
  }
}


// A = class extends A {
//   b: number;
//   constructor() {
//     super();
//     this.b = 6;
//   }
// }

// A.prototype.constructor = function A() {
//   //const a = A.prototype.constructor;
//   this.b = 6;
//   //@ts-ignore
//   //a.b = 6;
//   //return a;
// }

// A.prototype.constructor = class B extends A {
//   b: number;

//   constructor() {
//     super();
//     this.b = 6;
//   }
// }

// A.constructor = function() {
//   this.b = 3;
//   return {
//     b: 6
//   };
// }

A.constructor = class B extends A {
  b: number;

  constructor() {
    super();
    this.b = 6;
  }
}

export function aa() {
  const a = new A();
  console.log(a);
}

aa();