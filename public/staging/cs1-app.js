(function () {
  'use strict';

  (async () => {
    // create blue box
    window.box = await CS1.scene.add("a-box");
    console.log("window.box");
    console.log(window.box);
    window.box?.setAttribute("color", "blue");
    window.box?.object3D.position.set(0, 1, -5);
    
    //add a-cursor as child of camera
    const cursor = document.createElement('a-cursor','');
    CS1.cam.entity.appendChild(cursor);
    window.box.addEventListener("click", e => {
      StateManager.dispatch({type:"path-mutation", payload:{
        path: "house.rooms.bathroom.locked" , value: (window.box.getAttribute("color")==="green")? false:true
      }});
    });
    
    StateManager.subscribe("house.rooms.bathroom.locked", ()=>{
      window.box.setAttribute("color", (window.box.getAttribute("color")==="green")? "red":"green");
    });
    
  })();

  // App source code.
  (async ()=>{

  console.log("STARTING APP ...");
   
  })();

})();
//# sourceMappingURL=cs1-app.js.map
