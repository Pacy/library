import { Injectable } from "@angular/core";

@Injectable // class annotation as Injectable, "so that you can inject it in the constructor i.e."
    ({
        providedIn: 'root'
    })
export class mediaSearchOptions {
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
        "Release Year" : "releaseYear",
        "Title": "title"
    }
    // toDO (genre would have to be extended to include game/music/movies genres) or adapt genre in selection pages depending on media typ
    // could also argue, that priority for the lib is on books, therefore search pages only filter genres by books (for now)
    private genres = ["-- All --", "Adventure",  "Art", "Children", "Cooking", "Crafts, Hobbies & Home", "Crime","--Disc--", "Education", "Fantasy","--Game--", "Health & Fitness", "Historical", "Horror", "Humor", "Motivational", "Politics", "Religiion", "Roman", "Romance", "Thriller", "Sci-fi", "--VideoGame--"]
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
}