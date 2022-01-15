export const DispatchManager = {
  setStore: function(store){
    DispatchManager.store = store;
  },
  dispatch: function(action , lastState){
    /*
    If a path-mutation action type is received,
    we must split the path and iterate over the 
    upstream nodes calling upstream-node-notification
    action type dispatches to each upstream sub-path.
    
    WHAT WE WANT TO AVOID IS TRIGGERING ANY DISPATCHES
    TO SUPER-PATHS. I NEED TO IDENTIFY AND IMPLEMENT
    THE CHECKS AND RESPONSES TO ACHIEVE THIS.
    */
    if(action.type === "path-mutation"){
      DispatchManager.store.store.dispatch(action);
    }else{
      
    }
  }
};