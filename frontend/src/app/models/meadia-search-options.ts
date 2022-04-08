import { Injectable } from "@angular/core";

@Injectable // class annotation as Injectable, "so that you can inject it in the constructor i.e."
    ({
        providedIn: 'root'
    })
export class mediaSearchOptions {
    private searchFields = ["No restriction", "Author", "Isbn", "Media type", "Publisher", "Title"]
    private languages = ["-- All --", "English", "German"];
    // toDO (genre would have to be extended to include game/music/movies genres) or adapt genre in selection pages depending on media typ
    // could also argue, that priority for the lib is on books, therefore search pages only filter genres by books (for now)
    private genres = ["-- All --", "Art", "Children", "Cooking", "Crafts, Hobbies & Home", "Crime", "Education", "Health & Fitness", "Historical", "Horror", "Humor", "Motivational", "Politics", "Religiion", "Romance", "Thriller", "Adventure", "Fantasy", "Roman", "Sci-fi"]
    private mediaTypes = ["-- All --", "Book", "CD / DVD / Blu-Ray", "electronical Game", "Game", "Magazine"];
    private searchOperators = ["And", "Or", "Not"];

    getSearchFields() {
        return this.searchFields;
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

    // return a readable string of the search querry used. Omitting unused fields
    // probally less ideal spot for this functionality
    getSearchedForString(data) {
        let searchString = "";
  
        // if only 1 key is in data simple search was used
        // if more extended search, if neither is the case there must be an error
        if (Object.keys(data).length == 1) {
            searchString = data.searchTerm0;
        } else if (Object.keys(data).length > 1) {
            //##first search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm0 != "") {
                if (data.searchField0 == this.searchFields[0]) {
                    searchString += data.searchTerm0 + ", ";
                } else {
                    searchString += data.searchTerm0 + " in " + data.searchField0 + ", ";
                }
            }
            //##second search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm1 != "") {
                if (data.searchField1 == this.searchFields[0]) {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + ", ";
                } else {
                    searchString += data.searchOperator1.toLowerCase() + " " + data.searchTerm1 + " in " + data.searchField1 + ", ";
                }
            }
            //##third search querry##
            //check if searchTerm is not empty;
            //  true: then if search was restricted, false: skip
            if (data.searchTerm2 != "") {
                if (data.searchField2 == this.searchFields[0]) {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + ", ";
                } else {
                    searchString += data.searchOperator2.toLowerCase() + " " + data.searchTerm2 + " in " + data.searchField2 + ", ";
                }
            }

            //check if language, genre, mediaTyp have restriction -> if not, skip them
            if (data.language != this.languages[0]) {
                searchString += "language: " + data.language + ", ";
            }
            if (data.genre != this.genres[0]) {
                searchString += "genre: " + data.genre + ", ";
            }
            if (data.mediaType != this.mediaTypes[0]) {
                searchString += "media type: " + data.mediaType + ", ";
            }
        //optional remove last "," from string or put ", " at the start instead and remove the ";" from media-search-result.html

        // unexpected data length. return an error    
        } else {
            return "error getting search string";
        }
        return searchString;
    }

    getSvg(mediaType: string) {
        switch (mediaType) {
          case this.mediaTypes[1]: return "fas fa-book";  //"menu_book";
          case this.mediaTypes[2]: return "fas fa-compact-disc"; //"album";
          case this.mediaTypes[3]: return "fas fa-gamepad"; //"videogame_asset";
          case this.mediaTypes[4]: return "fas fa-dice";// "casino";
          case this.mediaTypes[5]: return "far fa-newspaper"; // "article";
          default: return "fas fa-bug"; //"error";
        }
      }
}