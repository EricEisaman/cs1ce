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
StateManager.getLastState = () => {
  return deepCopy(StateManager.lastState);
}
import { InitialState } from "./InitialState.js";
StateManager.lastState = deepCopy(InitialState);
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

// Start off with naive O(n^2) approach
// Later implement pre-processing in addSubcription to group
// all subscriptions within superpaths
// a balanced state graph will optimize then to O(n*log(n))
function callSuperpathSubscriptionHandlers(slice) {
  const keys = slice.split(".");
  subscriptions.forEach(function (subscription) {
    const superpaths = [];
    superpaths.push(`${keys[0]}`);
    if (keys.length > 2) {
      superpaths.push(`${keys[0]}.${keys[1]}`);
    }
    if (keys.length > 3) {
      superpaths.push(`${keys[0]}.${keys[1]}.${keys[2]}`);
    }
    if (keys.length > 4) {
      superpaths.push(`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}`);
    }
    if (keys.length > 5) {
      superpaths.push(`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}`);
    }
    superpaths.forEach((sp) => {
      if (subscription.slice === sp) {
        console.log("Calling subscription handler of superpath.");
        subscription.handler();
      }
    });
  });
}

function globalHandler_() {
  console.log("Running global handler!");
  subscriptions.forEach(function (subscription) {
    subscription.isPath = subscription.slice.includes(".");
    const keys = subscription.slice.split(".");
    let currentValue = StateManager.getState();
    keys.forEach(function (key) {
      if (currentValue) {
        currentValue = currentValue[key];
      }
    });
    let previousValue = StateManager.getLastState();
    keys.forEach(function (key) {
      console.log("key: ", key);
      if (previousValue) {
        previousValue = previousValue[key];
        console.log(previousValue);
      }
    });
    console.log("previous value: ", previousValue);
    console.log("current value: ", currentValue);
    if (!equals(previousValue, currentValue)) {
      console.log("Calling subscription handler.");
      subscription.handler();
      console.log("Alerting Network Update Manager!");
      markForNetworkUpdate(subscription.slice);
      if (subscription.isPath) {
        callSuperpathSubscriptionHandlers(keys);
      }
    }
  });
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
