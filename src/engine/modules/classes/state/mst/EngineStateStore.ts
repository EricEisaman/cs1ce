export let CS1;

import {
  types,
  onSnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  getParent,
} from "mobx-state-tree";

const RendererStateModel = types
  .model("RendererStateModel", {
    ready: false,
  })
  .actions((renderer) => ({
    setReady(): void {
      renderer.ready = true;
      console.log("RENDERER READY!");
      console.log(renderer);
      CS1.cam.setup();
    },
  }));

interface IRendererStateModel extends Instance<typeof RendererStateModel> {}
interface IRendererStateModelSnapshotIn
  extends SnapshotIn<typeof RendererStateModel> {}
interface IRendererStateModelSnapshotOut
  extends SnapshotOut<typeof RendererStateModel> {}

const CamStateModel = types
  .model("CamStateModel", {
    ready: false,
  })
  .actions((cam) => ({
    setReady(): void {
      cam.ready = true;
      console.log("CAM READY!");
      CS1.rig.setup();
    },
  }));

interface ICamStateModel extends Instance<typeof CamStateModel> {}
interface ICamStateModelSnapshotIn extends SnapshotIn<typeof CamStateModel> {}
interface ICamStateModelSnapshotOut extends SnapshotOut<typeof CamStateModel> {}

const RigStateModel = types
  .model("RigStateModel", {
    ready: false,
  })
  .actions((rig) => ({
    setReady(): void {
      rig.ready = true;
      console.log("RIG READY!");
      CS1.scene.setup();
    },
  }));

interface IRigStateModel extends Instance<typeof RigStateModel> {}
interface IRigStateModelSnapshotIn extends SnapshotIn<typeof RigStateModel> {}
interface IRigStateModelSnapshotOut extends SnapshotOut<typeof RigStateModel> {}

const SceneStateModel = types
  .model("SceneStateModel", {
    ready: false,
  })
  .actions((scene) => ({
    setReady(): void {
      scene.ready = true;
      console.log("SCENE READY!");
      EngineStateStore.setReady();
    },
  }));

interface ISceneStateModel extends Instance<typeof SceneStateModel> {}
interface ISceneStateModelSnapshotIn
  extends SnapshotIn<typeof SceneStateModel> {}
interface ISceneStateModelSnapshotOut
  extends SnapshotOut<typeof SceneStateModel> {}

const EngineStateModel = types
  .model("EngineStateModel", {
    renderer: RendererStateModel,
    cam: CamStateModel,
    rig: RigStateModel,
    scene: SceneStateModel,
    ready: false
  })
  .actions((engine) => ({
    setReady(): void {
      engine.ready = true;
      console.log("CS1 Engine is READY!");
      CS1.runAppEntryPoint();
      delete(CS1.runAppEntryPoint);
      delete(CS1.config);
    },
    setEngine(cs1): void {
      CS1 = cs1;
    }
  }));

interface IEngineStateModel extends Instance<typeof EngineStateModel> {}
interface IEngineStateModelSnapshotIn
  extends SnapshotIn<typeof EngineStateModel> {}
interface IEngineStateModelSnapshotOut
  extends SnapshotOut<typeof EngineStateModel> {}

export const EngineStateStore = EngineStateModel.create();

// Listen to new snapshots, which are created anytime something changes
onSnapshot(EngineStateStore, (snapshot) => {
  console.log("SNAPSHOT");
  console.log(snapshot);
});
