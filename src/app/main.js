// App source code.
(async ()=>{

console.log("STARTING APP ...");
window.box = await CS1.scene.add("a-box");
console.log("window.box");
console.log(window.box);
window.box?.setAttribute("color","blue");
window.box?.object3D.position.set(0,1,-5);
 
})()

