let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;

// App source code.
(async ()=>{

console.log("STARTING CS1 APP ...");
  
console.log(`The TypeScript number called decimal has a value of : ${decimal}!`);
 
})()

import { StateTest } from "./modules/classes/StateTest";

const myStateTest = new StateTest();
myStateTest.run();