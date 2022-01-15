// Manages data requiring updating via the network.
let StateManager;
export function initNetworkUpdateManager(StateManager){
  StateManager = StateManager;
}


let updateData = {};


export function getUpdateData(){
  const data = {...updateData};
  var props = Object.getOwnPropertyNames(updateData);
  for (var i = 0; i < props.length; i++) {
    delete updateData[props[i]];
  }
  return data;
}

// This will handle the transport of only dirty values!
export function markForNetworkUpdate(slice){
  console.log(`Marking slice : ${slice} for update.`);
}