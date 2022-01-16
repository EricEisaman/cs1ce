// Currently exposing dispatch. Eventually dispatch will be conducted under the hood.
export const StateManager = {
  getState: null,

  dispatch: null,

  subscribe: addSubscription,
};

import { GlobalStore } from "./GlobalStore.js";
const store = new GlobalStore(StateManager);
import { equals , deepCopy , getDecendantProp } from "../../utils.js";
StateManager.getState = () => {
  return deepCopy(store.store.getState());
};
import { InitialState } from "./InitialState.js";
StateManager.lastState = deepCopy(InitialState);
StateManager.getLastState = () => {
  return deepCopy(StateManager.lastState);
}
import { DispatchManager } from "./DispatchManager.js";
DispatchManager.setStore(store);
/*
 The decision to include the last state in dispatch is a current consideration
 but can very likely be revoked. In fact the need for the DispatchManager is
 under reconsideration.
*/
StateManager.dispatch = (action)=>{
  DispatchManager.dispatch(action , StateManager.getLastState());
};
import {
  initNetworkUpdateManager,
  markForNetworkUpdate,
} from "./NetworkUpdateManager.js";
initNetworkUpdateManager(StateManager);
const subscriptions = [];

function addSubscription(slice, handler) {
  subscriptions.push({ slice: slice, handler: handler });
}

function globalHandler() {
  console.log("Running global handler!");
  const lastState = StateManager.getLastState();
  const currentState = StateManager.getState();
  subscriptions.forEach(function (subscription) {

    let currentValue = getDecendantProp(currentState , subscription.slice);    
    let lastValue = getDecendantProp(lastState , subscription.slice);    
    
    console.log("last value: ", lastValue);
    console.log("current value: ", currentValue);
    if (!equals(lastValue, currentValue)) {
      /*
       I need to know if the current subscription.slice
       is the same slice mutation that caused this call.
       By passing the slice mutation to the superpath
       subscription handler, the handler doesn't have to 
       find out what specific thing(s) changed.
      */
      console.log("Calling subscription handler.");
      subscription.handler();
      /*
       Currently marking everything for network update.
       I will eventually add a filter here.
      */
      console.log("Alerting Network Update Manager!");
      markForNetworkUpdate(subscription.slice);
    }
  });
  StateManager.lastState = currentState;
}

store.store.subscribe(globalHandler);
