interface CS1 {
  cam: any;
  rig: any;
  scene: any;
  run: any;
  config: any;
}

import {
  Component,
  Entity,
  MultiPropertySchema,
  System,
  SystemDefinition,
  THREE,
  Geometry,
  registerComponent,
  Scene,
} from "aframe";

declare global {
  interface Window {
    CS1: CS1;
    StateManager: any;
    AFRAME: any;
    EngineStateStore: any;
  }
}

import { loadScript } from "./modules/utils.js";
import { registry } from "./modules/registry.js";
import { CS1Scene } from "./modules/classes/CS1Scene.js";
import { CS1Cam } from "./modules/classes/CS1Cam.js";
import { CS1Rig } from "./modules/classes/CS1Rig.js";
import { StateManager } from "./modules/classes/state/redux/StateManager.js";
import { EngineStateStore } from "./modules/classes/state/mst/EngineStateStore";
window.EngineStateStore = EngineStateStore;
/*
CS1 pattern for wrapping A-Frame entities
CS1.<name> is the CS1 wrapper with convenience methods and properties
CS1.<name>.entity is the A-Frame entity
This avoids concerns with entity lifetime events, state, and namespace.
In addition it maintains an isolated CS1 namespace for possible porting to
other underlying frameworks.
*/
(async () => {
  const CS1: CS1 = (window.CS1 = {
    cam: {},
    rig: {},
    scene: {},
    config: () => {},
    run: () => {},
  });
  window.StateManager = StateManager;
  CS1.run = (main) => {
    const ready = StateManager.getState().engine.ready;
    console.log(`engine.ready state in CS1.run is ${ready}!`);
    if (ready) {
      console.log("Calling app main() from CS1!");
      main();
    } else {
      console.log("Subscribing to engine.ready in CS1.run!");
      const subId = StateManager.subscribe("engine.ready", () => {
        StateManager.unsubscribe(subId);
        console.log("engine.ready handler is firing!");
        console.log("Calling app main() from CS1!");
        main(); 
      });
    }
  };
  console.log("Instantiating CS1 Cam, Rig, and Scene");
  CS1.cam = new CS1Cam();
  CS1.rig = new CS1Rig();
  CS1.scene = new CS1Scene();
  await loadScript(registry.cdn.AFRAME);
  console.log("AFRAME :");
  console.log(window.AFRAME);
  console.log("The renderer is ready!!");
  await loadScript(registry.cdn.simpleNavmeshConstraint);
  await loadScript(registry.cdn.rigWASDControls);
  StateManager.dispatch({
    type: "path-mutation",
    payload: {
      path: "renderer.ready",
      value: true,
    },
  });
})();
