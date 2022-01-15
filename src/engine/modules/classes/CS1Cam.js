export class CS1Cam {
  constructor() {
    //CS1.scene.clock.autoStart = false;
    //CS1.scene.appendChild(CS1.myPlayer);
    this.entity = document.createElement("a-entity");
    this.entity.setAttribute("camera", "active:true");
    this.entity.setAttribute("position", "0 1.6 0");
    //CS1.cam.setAttribute('wasd-controls','enabled: false;');
    //CS1.cam.setAttribute("follow", "target: #cam-target;");
    this.entity.setAttribute("look-controls", "pointerLockEnabled:true;");
  }
}
