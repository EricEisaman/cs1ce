import { StateManager } from "./state/StateManager.js";

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

  setupCam() {
    console.log("Setting up cam.");
    this.entity = document.createElement("a-entity");

    this.entity.setAttribute("camera", "active:true");
    this.entity.setAttribute("position", "0 1.6 0");
    //CS1.cam.setAttribute('wasd-controls','enabled: false;');
    //CS1.cam.setAttribute("follow", "target: #cam-target;");
    this.entity.setAttribute("look-controls", "pointerLockEnabled:true;");
  }
}
