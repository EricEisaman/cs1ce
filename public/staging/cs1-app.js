(function () {
    'use strict';

    const CS1$1 = window.CS1;
    const StateManager = window.StateManager;
    class NavmeshTest {
        constructor() { }
        async run() {
            // create blue box
            const box = await CS1$1.scene.add("a-box");
            console.log("box");
            console.log(box);
            box?.setAttribute("color", "yellow");
            box?.object3D.position.set(0, 1, -5);
            const map = document.createElement("a-gltf-model");
            map.setAttribute("src", "https://cdn.glitch.global/a5d65106-3958-4418-bb95-17edbf2b08ae/map.glb?v=1649608846769");
            map.setAttribute("id", "map");
            const navmesh = document.createElement("a-gltf-model");
            navmesh.setAttribute("src", "https://cdn.glitch.global/a5d65106-3958-4418-bb95-17edbf2b08ae/navmesh%20(18).gltf?v=1649608988048");
            navmesh.id = "navmesh";
            CS1$1.scene.entity.appendChild(map);
            CS1$1.scene.entity.appendChild(navmesh);
            //add a-cursor as child of camera
            //const cursor = document.createElement("a-cursor");
            //CS1.cam.entity.appendChild(cursor);
            //add navmesh constraint to camera
            CS1$1.cam.entity.setAttribute("simple-navmesh-constraint", "navmesh:#navmesh;fall:0.5;height:1.65;");
            box.addEventListener("click", (e) => {
                StateManager.dispatch({
                    type: "path-mutation",
                    payload: {
                        path: "house.rooms.bathroom.locked",
                        value: box.getAttribute("color") === "green" ? false : true,
                    },
                });
            });
            StateManager.subscribe("house.rooms.bathroom.locked", () => {
                box.setAttribute("color", box.getAttribute("color") === "green" ? "red" : "green");
            });
        }
    }

    //import { StateTest } from "./modules/classes/StateTest";
    const CS1 = window.CS1; // We will eventually publish typedefs to be imported.
    let decimal = 6.0;
    // App source code.
    (async () => {
        console.log(`The TypeScript number called decimal has a value of : ${decimal}!`);
        const main = () => {
            //const myStateTest = new StateTest();
            const myNavmeshTest = new NavmeshTest();
            //myStateTest.run();
            myNavmeshTest.run();
        };
        /*
        await CS1.engine.config({
          renderer: "Babylon"
        });
        await CS1.registry.entities.add({
          dog : "https://cdn.animals/dog.glb"
        });
        await CS1.registry.sounds.add({
          moo : "https://cdn.animals/moo.mp3"
        });
        await CS1.registry.particles.add({
          snow : "https://cdn.parts/snow.json"
        });
        await CS1.registry.pack.add({
          entities: {},
          sounds: {},
          particles: {}
        });
        await CS1.registry.pack.add("https://cdn.packs/monsters.json");
        await CS1.registry.pack.add("https://my.api/monsters/2");
        await sphere = CS1.add('sphere');
        sphere.position.set(2,0,-6);
        await box = CS1.add('box');
        const offset = "0 4 0";
        box.position.at(sphere, offset);
        */
        console.log("Calling CS1.run!");
        CS1.run(main);
    })();

})();
//# sourceMappingURL=cs1-app.js.map
