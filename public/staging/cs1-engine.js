(function () {
  'use strict';

  const utils = {
    loadScript: function (url, test) {
      return new Promise(function (resolve, reject) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.addEventListener("load", function () {
          this.removeEventListener("load", this);
          if (test) {
            utils.resolveWhenTrue(resolve, reject, test);
          } else {
            console.log("Resolving loadScript in utils!");
            resolve();
          }
        });
        script.src = url;
        head.appendChild(script);
      });
    },

    resolveWhenTrue: function (resolve, reject, test) {
      let count = 0;
      setTimeout(() => {
        if (test) {
          resolve();
        } else if (count < 1000) {
          utils.resolveWhenTrue(resolve, test);
          count++;
        } else {
          reject(test);
        }
      }, 200);
    },

    uuid: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },

    equals: function (a, b) {
      var typeofa, typeofb, i, len, key;

      // If a and b refer to the same object then they are equal.
      if (a === b) return true;

      // Get the native type of both a and b. Use the built-in valueOf()
      // function to get the native object of each variable.
      typeofa = a === null ? "null" : typeof (a = a ? a.valueOf() : a);
      typeofb = b === null ? "null" : typeof (b = b ? b.valueOf() : b);

      // If a and b are not the same native type.
      if (typeofa !== typeofb) return false;

      switch (typeofa) {
        case "string":
        case "boolean":
        case "number":
        case "functon":
        case "undefined":
        case "null":
          return a === b;
      }

      // Convert the native type to a string. This allows us to test
      // if either a or b are Arrays and then handle accordingly.
      typeofa = {}.toString.call(a);
      typeofb = {}.toString.call(b);

      if (typeofa === typeofb) {
        // Compare the items of two arrays
        if (typeofa === "[object Array]") {
          if (a.length !== b.length) return false;

          len = a.length;
          for (i = 0; i < len; i++) {
            if (!utils.equals(a[i], b[i])) return false;
          }
          // Compare the keys of two objects
        } else {
          for (key in a) {
            if (!(key in b)) return false;

            if (!utils.equals(a[key], b[key])) return false;
          }
        }
      } else {
        return false;
      }

      return true;
    },

    deepCopy: (inObject) => {
      let outObject, value, key;

      if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
      }

      // Create an array or object to hold the values
      outObject = Array.isArray(inObject) ? [] : {};

      for (key in inObject) {
        value = inObject[key];

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = utils.deepCopy(value);
      }

      return outObject;
    },

    getDecendantProp: function (obj, desc) {
      var arr = desc.split(".");
      while (arr.length) {
        obj = obj[arr.shift()];
      }
      return obj;
    },

    setDecendantProp: function (obj, desc, value) {
      var arr = desc.split(".");
      while (arr.length > 1) {
        obj = obj[arr.shift()];
      }
      return (obj[arr[0]] = value);
    },
  };

  const uuid = utils.uuid;
  const loadScript = utils.loadScript;
  const equals = utils.equals;
  const deepCopy = utils.deepCopy;
  const getDecendantProp = utils.getDecendantProp;
  const setDecendantProp = utils.setDecendantProp;

  const registry = {
    npm : {},
    cdn : {
      AFRAME : "https://cdnjs.cloudflare.com/ajax/libs/aframe/1.2.0/aframe.min.js"
    }
  };

  /**
   * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
   *
   * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
   * during build.
   * @param {number} code
   */
  function formatProdErrorMessage(code) {
    return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
  }

  // Inlined version of the `symbol-observable` polyfill
  var $$observable = (function () {
    return typeof Symbol === 'function' && Symbol.observable || '@@observable';
  })();

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };

  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */

  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error(formatProdErrorMessage(0) );
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error(formatProdErrorMessage(1) );
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error(formatProdErrorMessage(2) );
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    /**
     * This makes a shallow copy of currentListeners so we can use
     * nextListeners as a temporary list while dispatching.
     *
     * This prevents any bugs around consumers calling
     * subscribe/unsubscribe in the middle of a dispatch.
     */

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */


    function getState() {
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(3) );
      }

      return currentState;
    }
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */


    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error(formatProdErrorMessage(4) );
      }

      if (isDispatching) {
        throw new Error(formatProdErrorMessage(5) );
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error(formatProdErrorMessage(6) );
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
        currentListeners = null;
      };
    }
    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */


    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(formatProdErrorMessage(7) );
      }

      if (typeof action.type === 'undefined') {
        throw new Error(formatProdErrorMessage(8) );
      }

      if (isDispatching) {
        throw new Error(formatProdErrorMessage(9) );
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      return action;
    }
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */


    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error(formatProdErrorMessage(10) );
      }

      currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
      // Any reducers that existed in both the new and old rootReducer
      // will receive the previous state. This effectively populates
      // the new state tree with any relevant data from the old one.

      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */


    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object' || observer === null) {
            throw new Error(formatProdErrorMessage(11) );
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[$$observable] = function () {
        return this;
      }, _ref;
    } // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.


    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[$$observable] = observable, _ref2;
  }

  /*
  The intention of the reactions is to provide a dynamic middleware as opposed to the default redux middleware dispatch wrapper.

  The engine will create reactions for the user based upon the globally tracked and shared state.
  */
  class Reducer {
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
      const path = action.payload.path;
      const value = action.payload.value;
      setDecendantProp(result, path, value);
      console.log("Reaction returning : ", result);
      return result;
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
        console.log("Reaction returning : ", result);
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
          console.log(`The action.payload.path is ${action.payload.path}.`);
          return reaction.mutation(state, action);
        } else {
          return this.addReplace(state, action);
        }
      };
    }
  }

  let InitialState = {
    app: {
      id: 1,
    },
    cam: {
      ready: false,
    },
    engine: {
      ready: false,
    },
    renderer: {
      ready: false,
      type: "THREE",
    },
    ecs: {
      type: "AFRAME",
    },
    house: {
      rooms: {
        livingRoom: { occupied: false, locked: false },
        kitchen: { occupied: false, locked: false },
        bathroom: { occupied: false, locked: false },
      },
      securityEnabled: false,
    },
  };

  class GlobalStore {
    constructor(StateManager) {
      this.reducer = new Reducer(StateManager);
      this.store = createStore(
        this.reducer.reducer,
        InitialState,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      );
    }
  }

  /*
  The DispatchManager was originally created to run conditional
  logic related to the path-mutation action type.  This intermediary
  may not be required any longer as the superpath subscription handlers
  are now taken care of by using deep cloning , deep equality checks  ,
  and getting descendant property values at path.
  */
  const DispatchManager = {
    setStore: function(store){
      DispatchManager.store = store;
    },
    dispatch: function(action , lastState){
      if(action.type === "path-mutation"){
        DispatchManager.store.store.dispatch(action);
      }
    }
  };

  /*
   We will only transport dirty values!
   Consider sending only the dirty values at each level!
  */
  function markForNetworkUpdate(slice){
    console.log(`Marking slice : ${slice} for network update.`);
  }

  // Currently exposing dispatch. Eventually dispatch will be conducted under the hood.
  const StateManager = {
    getState: null,

    dispatch: null,

    subscribe: addSubscription,

    unsubscribe: removeSubscription,

  };
  const store = new GlobalStore(StateManager);
  StateManager.getState = () => {
    return store.store.getState();
  };
  StateManager.lastState = deepCopy(InitialState);
  DispatchManager.setStore(store);
  /*
   The decision to include the last state in dispatch is a current consideration
   but can very likely be revoked. In fact the need for the DispatchManager is
   under reconsideration.
  */
  StateManager.dispatch = (action) => {
    DispatchManager.dispatch(action, StateManager.lastState);
  };
  let subscriptions = [];

  function addSubscription(slice, handler) {
    const id = uuid();
    subscriptions.push({ id: id, slice: slice, handler: handler });
    return id;
  }

  function removeSubscription(id) {
    subscriptions = subscriptions.filter((s) => s.id !== id);
  }

  function globalHandler() {
    console.log("Running global handler!");
    const lastState = StateManager.lastState;
    const currentState = StateManager.getState();
    console.log("Last State :");
    console.log(lastState);
    console.log("Current State :");
    console.log(currentState);
    subscriptions.forEach(function (subscription) {
      let currentValue = getDecendantProp(currentState, subscription.slice);
      let lastValue = getDecendantProp(lastState, subscription.slice);

      console.log("last prop value: ", lastValue);
      console.log("current prop value: ", currentValue);
      if (!equals(lastValue, currentValue)) {
        /*
         Currently marking everything for network update.
         I will eventually add a filter here.
        */
        console.log("Alerting Network Update Manager!");
        markForNetworkUpdate(subscription.slice);
        /*
         I need to know if the current subscription.slice
         is the same slice mutation that caused this call.
         By passing the slice mutation to the superpath
         subscription handler, the handler doesn't have to 
         find out what specific thing(s) changed.
        */
        console.log("Calling subscription handler.");
        subscription.handler();
        StateManager.lastState = deepCopy(currentState);
      }
    });
  }

  store.store.subscribe(globalHandler);

  //import { player } from "./components/player";
  //import { follow } from "./components/follow";
  class CS1Scene {
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

  class CS1Cam {
    constructor() {
      const subId = StateManager.subscribe("renderer.ready", () => {
          StateManager.unsubscribe(subId);
          this.setupCam();
          this.announceReady();     
      });
    }

    announceReady() {
      console.log("Announcing cam.ready!");
      StateManager.dispatch({
        type: "path-mutation",
        payload: {
          path: "cam.ready",
          value: true,
        },
      });
    }

    setupCam() {
      console.log("Setting up cam.");
      this.entity = document.createElement("a-entity");

      this.entity.setAttribute("camera", "active:true");
      this.entity.setAttribute("position", "0 1.6 0");
      //CS1.cam.setAttribute('wasd-controls','enabled: false;');
      //CS1.cam.setAttribute("follow", "target: #cam-target;");
      this.entity.setAttribute("look-controls", "pointerLockEnabled:true;");
    }
  }

  /*
  CS1 pattern for wrapping A-Frame entities
  CS1.<name> is the CS1 wrapper with convenience methods and properties
  CS1.<name>.entity is the A-Frame entity
  This avoids concerns with entity lifetime events, state, and namespace.
  In addition it maintains an isolated CS1 namespace for possible porting to
  other underlying frameworks.
  */
  (async () => {
      const CS1 = (window.CS1 = {
          cam: {},
          scene: {},
          config: () => { },
          run: () => { },
      });
      window.StateManager = StateManager;
      CS1.run = (main) => {
          const ready = StateManager.getState().engine.ready;
          console.log(`engine.ready state in CS1.run is ${ready}!`);
          if (ready) {
              console.log("Calling app main() from CS1!");
              main();
          }
          else {
              console.log("Subscribing to engine.ready in CS1.run!");
              const subId = StateManager.subscribe("engine.ready", () => {
                  console.log("engine.ready handler is firing!");
                  console.log("Calling app main() from CS1!");
                  main();
                  StateManager.unsubscribe(subId);
              });
          }
      };
      console.log("Instantiating CS1 Scene and Cam");
      CS1.cam = new CS1Cam();
      CS1.scene = new CS1Scene(); // CS1.cam must be defined first
      await loadScript(registry.cdn.AFRAME);
      console.log("AFRAME :");
      console.log(window.AFRAME);
      console.log("The renderer is ready!!");
      StateManager.dispatch({
          type: "path-mutation",
          payload: {
              path: "renderer.ready",
              value: true,
          },
      });
  })();

})();
//# sourceMappingURL=cs1-engine.js.map
