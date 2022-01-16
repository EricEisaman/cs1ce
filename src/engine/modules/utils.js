export const utils = {
  loadScript: function (url) {
    return new Promise(function (resolve, reject) {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.addEventListener("load", function () {
        this.removeEventListener("load", this);
        resolve(script);
      });
      script.src = url;
      head.appendChild(script);
    });
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

export const equals = utils.equals;
export const deepCopy = utils.deepCopy;
export const getDecendantProp = utils.getDecendantProp;
export const setDecendantProp = utils.setDecendantProp;
