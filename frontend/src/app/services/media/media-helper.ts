import { Injectable } from "@angular/core";
// import { mediaSearchOptions } from "src/app/models/meadia-search-options";

@Injectable({ // class annotation as Injectable, "so that you can inject it in the constructor i.e."
    providedIn: 'root'
})
export class MediaHelper {
    constructor( ) { }

    //TODO optional generate searchFields via Object.keys from fronToBackendFieldName
    // private searchFields = ["No restriction", "Author", "Description", "Developer", "Isbn", "Publisher", "Release Year", "Title"]
    private languages = ["-- All --", "English", "German"];
    private frontToBackendFieldName = {
        "No restriction": "none",
        "Author": "authors",
        "Description": "description",
        "Developer": "developer",
        "Isbn": "isbn",
        "Publisher": "publisher",
        "Release Year": "releaseYear",
        "Title": "title"
    }
    // toDO (genre would have to be extended to include game/music/movies genres) or adapt genre in selection pages depending on media typ
    // could also argue, that priority for the lib is on books, therefore search pages only filter genres by books (for now)
    private genres = ["-- All --", "Adventure", "Art", "Children", "Cooking", "Crafts, Hobbies & Home", "Crime", "--Disc--", "Education", "Fantasy", "--Game--", "Health & Fitness", "Historical", "Horror", "Humor", "Motivational", "Politics", "Religiion", "Roman", "Romance", "Thriller", "Sci-fi", "--VideoGame--"]
    // genre  game/videogame/disc does not make sense, they are mediaTypes as categoriesed below. May have to make a seperate genre for the ones that have less overlaps, 
    // or make a bigger genre array.
    // i guess books, movies have pretty big overlaps. Videos games have to have their own genre type, disc have to compared with big -may have to add a category 'learning' there and see from then
    // board games need to check what genre they are split in

    private mediaTypes = ["-- All --", "Book", "CD / DVD / Blu-Ray", "electronical Game", "Game", "Magazine"];
    private searchOperators = ["and", "or", "not"];

    getSearchFields() {
        // return this.searchFields;
        return Object.keys(this.frontToBackendFieldName)
    }

      getFrontToBackendNames (){
          return this.frontToBackendFieldName;
      }

    getLanguages() {
        return this.languages;
    }
    getGenres() {
        return this.genres;
    }
    getMediaTypes() {
        return this.mediaTypes;
    }
    getSearchOperators() {
        return this.searchOperators;
    }



    /**
     * 
     * @param mediaType 
     * @returns css class name of scalable vector icon (font awesome icon)
     */
    getSvg(mediaType: string) {
        switch (mediaType) {
            case this.mediaTypes[1]: return "fas fa-book";  //"menu_book";
            case this.mediaTypes[2]: return "fas fa-compact-disc"; //"album";
            case this.mediaTypes[3]: return "fas fa-gamepad"; //"videogame_asset";
            case this.mediaTypes[4]: return "fas fa-dice";// "casino";
            case this.mediaTypes[5]: return "far fa-newspaper"; // "article";
            default: return "fas fa-bug"; // error svg ;
        }
    }


    /**
     * Return a readable string of the data search object (search querry). Omitting unused fields
     *  
     * @param data object from the quick/extended search 
     * @returns a string of the search querry used
     */
    getSearchedForString(data) {
        let searchString = "";
        const searchFields = this.getSearchFields();
        // if only 1 key is in data simple search was used
        // if more extended search, if neither is the case there must be an error
        if (Object.keys(data).length == 1) {
           return searchString = data.searchTerm0;
        } else if (Object.keys(data).length > 1) {
            //##first search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm0") && data.searchTerm0 != "") {
                if (data.searchField0 == searchFields[0]) {
                    searchString += data.searchTerm0 + ", ";
                } else {
                    searchString += data.searchTerm0 + " in " + data.searchField0 + ", ";
                }
            }
            //##second search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm1") && data.searchTerm1 != "") {
                if (data.searchField1 == searchFields[0]) {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + ", ";
                } else {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + " in " + data.searchField1 + ", ";
                }
            }
            //##third search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm2") && data.searchTerm2 != "") {
                if (data.searchField2 == searchFields[0]) {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + ", ";
                } else {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + " in " + data.searchField2 + ", ";
                }
            }

            //check if language, genre, mediaTyp have restriction -> if not, skip them
            if (data.hasOwnProperty("language") && data.language != this.languages[0]) {
                searchString += "language: " + data.language + ", ";
            }
            if (data.hasOwnProperty("genre") && data.genre != this.genres[0]) {
                searchString += "genre: " + data.genre + ", ";
            }
            if (data.hasOwnProperty("mediaType") && data.mediaType != this.mediaTypes[0]) {
                searchString += "media type: " + data.mediaType + ", ";
            }
            //optional remove last "," from string or put ", " at the start instead and remove the ";" from media-search-result.html

            // unexpected data length. return an error    
        } else {
            return "error getting search string";
        }
        return searchString;
    }



   /**
    * Simplify a search object (extended search) by removing not used fields. 
    * For quicksearch this method (generalise the object) adds a property field:none to match the extended search object structure
    * 
    * General object form is ={ searchTermX: {field: value_fieldX, value: value_valueX, operator: value_operatorX}, language:value_language, genre: value_genre, mediaType:value_mediaType,}
    * x € 0-2; searchTerm0 does not have an operator field
    * 
    * For simplicity reasons boolean search operators (and, or, not) from the field are connected in order they were choose
    *    and not focused on higher priority order of certain opertatos. 
    * (Furthermore, additional operator (*,?,..) in an input field are also not support right now)
    * 
    * @param data 
    * @returns an object that includes only used fields in the specified form
    */
    simplifySearchObject(data) {
        let obj = {}
        if (Object.keys(data).length == 1) { //quick Search was used 
            obj["searchTerm0"] = {}
            obj["searchTerm0"]["field"] = "none";// { "none": data.searchTerm0 };
            obj["searchTerm0"]["value"] = data.searchTerm0;
        } else {
            //##first search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm0") && data.searchTerm0 !== "") {
                obj["searchTerm0"] = {};
                obj["searchTerm0"]["field"] = this.frontToBackendFieldName[data.searchField0]
                obj["searchTerm0"]["value"] = data.searchTerm0;
            }
            //##second search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm1") && data.searchTerm1 !== "") {
                obj["searchTerm1"] = {};
                obj["searchTerm1"]["field"] = this.frontToBackendFieldName[data.searchField1]
                obj["searchTerm1"]["operator"] = data.searchOperator1;
                obj["searchTerm1"]["value"] = data.searchTerm1;
            }
            //##third search querry##
            //check if searchTerm is not empty;
            //  true: search was restricted, false: skip
            if (data.hasOwnProperty("searchTerm2") && data.searchTerm2 !== "") {
                obj["searchTerm2"] = {};
                obj["searchTerm2"]["field"] = this.frontToBackendFieldName[data.searchField2]
                obj["searchTerm2"]["operator"] = data.searchOperator2;
                obj["searchTerm2"]["value"] = data.searchTerm2;
            }
            //check if language, genre, mediaTyp have restriction -> if not, skip them
            if (data.hasOwnProperty("language") && data.language != this.languages[0]) {
                obj["language"] = data.language
            }
            if (data.hasOwnProperty("genre") && data.genre != this.genres[0]) {
                obj["genre"] = data.genre
            }
            if (data.hasOwnProperty("mediaType") && data.mediaType != this.mediaTypes[0]) {
                obj["mediaType"] = data.mediaType
            }
        }
        return obj;
    }

    /**
     * Flatten a given (nested) object to an unflatten object. The unflatten object contains information about the previous form, so that it can be unflatten later
     * (i.e key1.keys2: value)
     * 
     * @param object nested object to be flatten
     * @param prefix prefix for recursive calls (to keep nested information)
     * @param res 
     * @returns flatten object that retains nested information
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
  *  **Does not flatten arrays within the object
  * 
  * @param object nested object to be flatten
  * @param res 
  * @returns flatten object (does not flatten array values)
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
