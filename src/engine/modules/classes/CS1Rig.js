import { StateManager } from "./state/redux/StateManager.js";
import { EngineStateStore } from "./state/mst/EngineStateStore"

export class CS1Rig {
  constructor() {
    const subId = StateManager.subscribe("cam.ready", () => {
        StateManager.unsubscribe(subId);
        this.setupRig();
        this.announceReady();     
    });
  }

  announceReady() {
    console.log("Announcing rig.ready!");
    StateManager.dispatch({
      type: "path-mutation",
      payload: {
        path: "rig.ready",
        value: true,
      },
    });
  }

  setupRig() {
    console.log("Setting up rig.");
    this.entity = document.createElement("a-entity");
    this.entity.name = "CS1 Rig Entity";
    console.log("SETTING UP RIG WITH CS1.cam.entity");
    console.log(CS1.cam.entity);
    this.entity.appendChild(CS1.cam.entity);
    this.entity.setAttribute("rig-wasd-controls", "");
  }
}