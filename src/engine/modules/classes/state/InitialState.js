export let InitialState = {
  appId: 1,
  house: {
    rooms: {
      livingRoom: { occupied: false, locked: false },
      kitchen: { occupied: false, locked: false },
      bathroom: { occupied: false, locked: false }
    },
    securityEnabled: false
  }
};
