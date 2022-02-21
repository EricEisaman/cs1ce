(function () {
    'use strict';

    const CS1$1 = window.CS1;
    const StateManager = window.StateManager;
    class StateTest {
        constructor() { }
        async run() {
            // create blue box
            const box = await CS1$1.scene.add("a-box");
            console.log("box");
            console.log(box);
            box?.setAttribute("color", "yellow");
            box?.object3D.position.set(0, 1, -5);
            //add a-cursor as child of camera
            const cursor = document.createElement("a-cursor");
            CS1$1.cam.entity.appendChild(cursor);
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

    const CS1 = window.CS1; // We will eventually publish typedefs to be imported.
    let decimal = 6;
    // App source code.
    (async () => {
        console.log(`The TypeScript number called decimal has a value of : ${decimal}!`);
        const main = () => {
            const myStateTest = new StateTest();
            myStateTest.run();
        };
        console.log("Calling CS1.run!");
        CS1.run(main);
    })();

})();
//# sourceMappingURL=cs1-app.js.map
