import { StateManager } from "./state/StateManager.js";
//import { player } from "./components/player";
//import { follow } from "./components/follow";
export class CS1Scene {
  constructor() {
    this.entity = document.createElement("a-scene");
    const subId = StateManager.subscribe("cam.ready", () => {
      StateManager.unsubscribe(subId);
      this.setupScene();
      StateManager.dispatch({
        type: "path-mutation",
        payload: {
          path: "engine.ready",
          value: true,
        },
      });
    });
  }

  setupScene() {
    if (window.AFRAME?.scenes[0]) {
      this.entity = window.AFRAME?.scenes[0];
      const cam = document.querySelector("[camera]");
      cam.parentNode.removeChild(cam);
    } else {
      this.entity = document.createElement("a-scene");
    }
    this.entity.appendChild(CS1.cam.entity);
    if (!window.AFRAME?.scenes[0]) document.body.appendChild(this.entity);
  }

  async add(arg) {
    return new Promise((resolve, reject) => {
      console.log("INSIDE SCENE ADD PROMISE ...");
      console.log("this.entity");
      console.log(this.entity);
      console.log("this.entity.hasLoaded");
      console.log(this.entity.hasLoaded);
      console.log("arg");
      console.log(arg);
      console.log("typeof arg");
      console.log(typeof arg);
      switch (typeof arg) {
        case "string":
          const entity = document.createElement(arg);
          if (this.entity.hasLoaded) {
            this.entity.appendChild(entity);
            resolve(entity);
          } else {
            document.querySelector("a-scene").addEventListener("loaded", () => {
              console.log("SCENE LOADED STRING ARG");
              this.entity.appendChild(entity);
              resolve(entity);
            });
          }
          break;
        default:
          const errorBox = document.createElement("a-box");
          errorBox.setAttribute("color", "red");
          errorBox.setAttribute("position", "0 0 -4");
          if (this.entity.hasLoaded) {
            this.entity.appendChild(errorBox);
            reject(errorBox);
          } else {
            document.querySelector("a-scene").addEventListener("loaded", () => {
              this.entity.appendChild(entity);
              reject(errorBox);
            });
          }
      }
    });
  }
}
