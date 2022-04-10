import { types, onSnapshot, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

const RendererStateModel = types
.model("RendererStateModel",{
  ready: false
})
.actions((renderer)=>({
  setReady():void{
    renderer.ready = true
  }
}))

interface IRendererStateModel extends Instance<typeof RendererStateModel> {} 
interface IRendererStateModelSnapshotIn extends SnapshotIn<typeof RendererStateModel> {} 
interface IRendererStateModelSnapshotOut extends SnapshotOut<typeof RendererStateModel> {} 

const CamStateModel = types
.model("CamStateModel",{
  ready: false
})
.actions((cam)=>({
  setReady():void{
    cam.ready = true
  }
}))

interface ICamStateModel extends Instance<typeof CamStateModel> {} 
interface ICamStateModelSnapshotIn extends SnapshotIn<typeof CamStateModel> {} 
interface ICamStateModelSnapshotOut extends SnapshotOut<typeof CamStateModel> {}

const SceneStateModel = types
.model("SceneStateModel",{
  ready: false
})
.actions((scene)=>({
  setReady():void{
    scene.ready = true
  }
}))

interface ISceneStateModel extends Instance<typeof SceneStateModel> {} 
interface ISceneStateModelSnapshotIn extends SnapshotIn<typeof SceneStateModel> {} 
interface ISceneStateModelSnapshotOut extends SnapshotOut<typeof SceneStateModel> {}

const EngineStateModel = types
    .model("EngineStateModel", {
        renderer:RendererStateModel,
        cam:CamStateModel,
        scene:SceneStateModel,
        ready: false
    })
    .actions((engine) => ({
        setReady():void {
            engine.ready = true
        }
    }))

interface IEngineStateModel extends Instance<typeof EngineStateModel> {} 
interface IEngineStateModelSnapshotIn extends SnapshotIn<typeof EngineStateModel> {} 
interface IEngineStateModelSnapshotOut extends SnapshotOut<typeof EngineStateModel> {}

export const EngineStateStore = EngineStateModel.create()

// Listen to new snapshots, which are created anytime something changes
onSnapshot(EngineStateStore, (snapshot) => {
    console.log(snapshot)
})





