import { AFRAME } from "./modules/vendor/AFRAME.js";
const CS1 = (window.CS1 = {});
import { CS1Scene } from "./modules/classes/CS1Scene.js";
import { CS1Cam } from "./modules/classes/CS1Cam.js";
import { StateManager } from "./modules/classes/state/StateManager.js";
/*
CS1 pattern for wrapping A-Frame entities
CS1.<name> is the CS1 wrapper with convenience methods and properties
CS1.<name>.entity is the A-Frame entity
This avoids concerns with entity lifetime events, state, and namespace.
In addition it maintains an isolated CS1 namespace for possible porting to
other underlying frameworks.
*/
window.StateManager = StateManager; //to be used internally by contributors
CS1.cam = new CS1Cam();
CS1.scene = new CS1Scene(); // CS1.cam must be defined first

 
