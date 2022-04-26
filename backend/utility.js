
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
     * lowerCase the keys in the object given and return an adjusted object then
     * @param {*} obj 
     * @returns obj
     */
     function lowerObjectKeys  (obj) {
        let result = {};
        // to do 
        return result;
      }
 module.exports = { unflattenObject, lowerObjectKeys};
