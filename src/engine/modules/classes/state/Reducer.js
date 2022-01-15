/*
The intention of the reactions is to provide a dynamic middleware as opposed to the default redux middleware dispatch wrapper.

The engine will create reactions for the user based upon the globally tracked and shared state.
*/
export class Reducer {
  constructor(StateManager) {
    this.reactions = [
      { type: "username", mutation: this.addReplace },
      { type: "level", mutation: this.addReplace },
      { type: "appId", mutation: this.addReplace },
      { type: "newProp", mutation: this.add },
      { type: "replacementProp", mutation: this.replace },
      { type: "house", mutation: this.addReplace },
      { type: "path-mutation", mutation: this.pathMutation },
      {
        type: "upstream-node-notification",
        mutation: this.upstreamNodeDispatchHandler,
      },
    ];
    this.createReducer();
  }

  pathMutation(state, action) {
    let result = state;
    const value = action.payload.value;
    const keys = action.payload.path.split(".");
    switch (keys.length) {
      case 2:
        result[keys[0]][keys[1]] = value;
        break;
      case 3:
        result[keys[0]][keys[1]][keys[2]] = value;
        break;
      case 4:
        result[keys[0]][keys[1]][keys[2]][keys[3]] = value;
        break;
      case 5:
        result[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = value;
        break;
      case 6:
        result[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]] = value;
        break;
    }
    return result;
  }

  upstreamNodeDispatchHandler(branchState, nodeToNotify) {
    /*
      Example:  subscription to house.rooms.bathroom.locked
      Here we will call locked the subscription node, which in general does not have to be a leaf.
      A path-mutation type action is dispatched with the payload path of house.rooms.bathroom.locked
      This will return the resulting subscription node value.
      It will also trigger a caching of the branchState to that leaf.
      We will also need to always have a global lastState cache to check when an
      upstream-node-notification action is dispatched, 
      whether or not the children are all clean.
    */
    let result = state;
    const value = action.payload.value;
    const keys = action.payload.path.split(".");
  }

  add(state, action) {
    let result = state;
    if (result[action.type]) {
      console.log(
        "Add mutation called for state property that already exists!"
      );
      return result;
    } else {
      result[action.type] = action.payload[action.type];
      console.log("Returning : ", result);
      return result;
    }
  }

  replace(state, action) {
    let result = state;
    if (result[action.type]) {
      result[action.type] = action.payload[action.type];
      console.log("Returning : ", result);
      return result;
    } else {
      console.log(
        "Replace mutation called for state property that does not exist!"
      );
      return result;
    }
  }

  addReplace(state, action) {
    let result = state;
    const type = action.type;
    if (type && action.payload && action.payload[type]) {
      result[type] = action.payload[type];
    }
    return result;
  }

  createReducer() {
    this.reducer = (state, action) => {
      console.log(`Searching the reactions for action.type : ${action.type}`);
      console.log("reactions: ", this.reactions);
      const reaction = this.reactions.filter((r) => r.type === action.type)[0];
      if (reaction) {
        console.log("Reaction found!");
        console.log(reaction);
        return reaction.mutation(state, action);
      } else {
        return this.addReplace(state, action);
      }
    };
  }
}
