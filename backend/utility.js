
    // copied from https://www.geeksforgeeks.org/how-to-unflatten-an-object-with-the-paths-for-keys-in-javascript/
    /**
     * Return the given object in unflatten form
     * 
     * @param obj an object in flatten form
     * @returns the unflatten version of `obj`
     * @example  
     * /returns { "car"{"seat":[{"seater":5}]}}
     * input obj: {"car"."seat".0."seater": 5}
    */   
     function unflattenObject (obj) {
        let result = {},
            temp,
            substrings,
            property,
            i;
        for (property in obj) {
            substrings = property.split("."); // split property into array which we iterate over
            temp = result;
            for (i = 0; i < substrings.length - 1; i++) {
                if (!(substrings[i] in temp)) { 
                    if (isFinite(substrings[i + 1])) { // if number, then it is an index of an array, else key name of object
                        temp[substrings[i]] = [];
                    } else {
                        temp[substrings[i]] = {};
                    }
                }
                temp = temp[substrings[i]];
            }
            temp[substrings[substrings.length - 1]] = obj[property];
        }
        return result;
    }

    /**
     * Check if an objective is empty or has some key-value pairs
     * @param {*} obj to test
     * @returns true or false
     */ 
     function objectIsEmpty(obj) {
        return Object.keys(obj).length == 0;
      }

      /**
       * 
       * @param {*} str expects a string to check if it is a number or not
       * @returns boolean
       */
      // code snippets (including comment) from https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
      function isNumber(str) {
          console.log(str, !isNaN(str),!isNaN(parseFloat(str)));
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }
 module.exports = { unflattenObject, objectIsEmpty, isNumber};
