import { StateManager } from "./state/redux/StateManager.js";
import { EngineStateStore } from "./state/mst/EngineStateStore"

export class CS1Cam {
  constructor() {
    const subId = StateManager.subscribe("renderer.ready", () => {
        StateManager.unsubscribe(subId);
        this.setupCam();
        this.announceReady();     
    });
  }

  announceReady() {
    console.log("Announcing cam.ready!");
    StateManager.dispatch({
      type: "path-mutation",
      payload: {
        path: "cam.ready",
        value: true,
      },
    });
  }
  
  setup() {
    console.log("FAKING THE CAM SETUP!");
  }

  setupCam() {
    console.log("Setting up cam.");
    this.entity = document.createElement("a-entity");
    this.entity.name = "CS1 Cam Entity";
    this.entity.setAttribute("camera", "active:true");
    this.entity.setAttribute("position", "0 1.65 0");
    this.entity.setAttribute("look-controls", "pointerLockEnabled: true");
  }
}
