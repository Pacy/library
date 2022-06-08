import { Injectable } from "@angular/core";
import { mediaSearchOptions } from "src/app/models/meadia-search-options";

@Injectable({
    providedIn: 'root'
  })
export class MediaHelper {
    constructor(
        private searchOption: mediaSearchOptions
      ) { }



     // return a readable string of the search querry used. Omitting unused fields
    // probally less ideal spot for this functionality
    getSearchedForString(data) {
        let searchString = "";
        const searchFields = this.searchOption.getSearchFields();
        const languages = this.searchOption.getLanguages();
        const genres = this.searchOption.getGenres();
        const mediaTypes = this.searchOption.getMediaTypes();

        // if only 1 key is in data simple search was used
        // if more extended search, if neither is the case there must be an error
        if (Object.keys(data).length == 1) {
            searchString = data.searchTerm0;
        } else if (Object.keys(data).length > 1) {
            //##first search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm0 != "") {
                if (data.searchField0 == searchFields[0]) {
                    searchString += data.searchTerm0 + ", ";
                } else {
                    searchString += data.searchTerm0 + " in " + data.searchField0 + ", ";
                }
            }
            //##second search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm1 != "") {
                if (data.searchField1 == searchFields[0]) {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + ", ";
                } else {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + " in " + data.searchField1 + ", ";
                }
            }
            //##third search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm2 != "") {
                if (data.searchField2 == searchFields[0]) {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + ", ";
                } else {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + " in " + data.searchField2 + ", ";
                }
            }

            //check if language, genre, mediaTyp have restriction -> if not, skip them
            if (data.language != languages[0]) {
                searchString += "language: " + data.language + ", ";
            }
            if (data.genre != genres[0]) {
                searchString += "genre: " + data.genre + ", ";
            }
            if (data.mediaType != mediaTypes[0]) {
                searchString += "media type: " + data.mediaType + ", ";
            }
            //optional remove last "," from string or put ", " at the start instead and remove the ";" from media-search-result.html

            // unexpected data length. return an error    
        } else {
            return "error getting search string";
        }
        return searchString;
    }


    /*
    * For simplicity reasons boolean search operators (and, or, not) from the field are connected in order they were choose
    *    and not focused on higher priority order of certain opertatos. 
    * (Furthermore, additional operator (and,or, not, *,?,..) in an input field are also not support right now)
    */
    simplifySearchObject(data) {
        const languages = this.searchOption.getLanguages();
        const genres = this.searchOption.getGenres();
        const mediaTypes = this.searchOption.getMediaTypes();
        const frontToBackendFieldName = this.searchOption.getFrontToBackendNames();


        let obj = {}
        if (Object.keys(data).length == 1) { //quick Search was used 
            obj["searchTerm0"] = {}
            obj["searchTerm0"]["field"] = "none";// { "none": data.searchTerm0 };
            obj["searchTerm0"]["value"] = data.searchTerm0;
        } else {
            //##first search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.searchTerm0 !== "") {
                obj["searchTerm0"] = {};
                obj["searchTerm0"]["field"] = frontToBackendFieldName[data.searchField0]
                obj["searchTerm0"]["value"] = data.searchTerm0;
            }
            //##second search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.searchTerm1 !== "") {
                obj["searchTerm1"] = {};
                obj["searchTerm1"]["field"] = frontToBackendFieldName[data.searchField1]
                obj["searchTerm1"]["operator"] = data.searchOperator1;
                obj["searchTerm1"]["value"] = data.searchTerm1;
            }
            //##third search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.searchTerm2 !== "") {
                obj["searchTerm2"] = {};
                obj["searchTerm2"]["field"] = frontToBackendFieldName[data.searchField2]
                obj["searchTerm2"]["operator"] = data.searchOperator2;
                obj["searchTerm2"]["value"] = data.searchTerm2;
            }
            //check if language, genre, mediaTyp have restriction -> if not, skip them
            if (data.language != languages[0]) {
                obj["language"] = data.language
            }
            if (data.genre != genres[0]) {
                obj["genre"] = data.genre
            }
            if (data.mediaType != mediaTypes[0]) {
                obj["mediaType"] = data.mediaType
            }
        }
        return obj;
    }

    /**
     * Flatten a given (nested) object to an unflatten object. The unflatten object contains information about being flatten
     * (i.e key1.keys2: value)
     * 
     * @param object nested object to be flatten
     * @param prefix prefix for recursive calls (to keep nested information)
     * @param res 
     * @returns flatten object
     */
    flattenObjectKeepInformation(object, prefix = '', res = {}) {
        Object.entries(object).reduce((r, [key, val]) => {
            const k = `${prefix}${key}`
            if (typeof val === "object") {
                this.flattenObjectKeepInformation(val, `${k}.`, r)
            } else {
                res[k] = val
            }
            return r
        }, res)
        return res;
    }

      /**
    * Flatten a given (nested) object to an unflatten object. The new object contains no information about previous nested representation.
    * (i.e key2: value ; no information about a potential key1 containing key2)
    * 
    * @param object nested object to be flatten
    * @param res 
    * @returns flatten object
    */
  flattenObjectLoseInformation(object, res = {}) {
    Object.entries(object).reduce((r, [key, val]) => {
      // const k = `${prefix}${key}`
      if (typeof val === "object") {
        if (Array.isArray(val)) {
          res[key] = val;
        }
        else
          this.flattenObjectLoseInformation(val, r)
      } else {
        res[key] = val
      }
      return r
    }, res)
    return res;
  }
}
