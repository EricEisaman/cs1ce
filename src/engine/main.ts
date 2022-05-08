interface CS1 {
  cam: any;
  rig: any;
  scene: any;
  renderer: any;
  ecs: any;
  run: any;
  config: any;
  runAppEntryPoint: any;
  state: any;
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

import { CS1Scene } from "./modules/classes/CS1Scene.js";
import { CS1Cam } from "./modules/classes/CS1Cam.js";
import { CS1Rig } from "./modules/classes/CS1Rig.js";
import { StateManager } from "./modules/classes/state/redux/StateManager.js";
import { EngineStateStore } from "./modules/classes/state/mst/EngineStateStore";
import { renderer } from "./modules/renderer";
import { config } from "./modules/config";
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
    renderer: {},
    ecs: {},
    config: () => {},
    run: () => {},
    runAppEntryPoint: () => {},
    state: {}
  });
  let appEntryPoint;
  CS1.runAppEntryPoint = ()=>{
    if(appEntryPoint){
      appEntryPoint();
    }else{
      console.error("appEntryPoint should have been already called. It is undefined in this scope.");
    }
  }
  EngineStateStore.setEngine(CS1);
  CS1.state = EngineStateStore;
  CS1.run = (main) => {
    const ready = EngineStateStore.ready;
    console.log(`engine.ready state in CS1.run is ${ready}!`);
    if (ready) {
      console.log("Calling app main() from CS1!");
      main();
      delete CS1.config;
    } else {
      appEntryPoint = main;
    }
  };
  console.log("Instantiating CS1 Cam, Rig, and Scene");
  CS1.cam = new CS1Cam();
  CS1.rig = new CS1Rig();
  CS1.scene = new CS1Scene();
  CS1.renderer = renderer;
  CS1.renderer.init();
})();
