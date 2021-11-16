export interface Media {
    id: number;
    title: string;
    releaseYear?: number;
    publisher?: string;
    description?: string;
    genre?: string;
    mediaTyp: string,
    purchasePrice?: string; //Actually not sure if actually needed in a library
    languages?: string[];
    tags?: string[];
    loanDuration?: number; //In days
    possibleExtensions?: number;
    possibleToTakeHome?: boolean; //if possible to take an exemplar home; at all
    currentlyAvailableExemplarsToTakeHome?: number; //currently avaiable exmplars to take home
    previewImageLink?: string;
    externalProductLink?: string;
}

export interface Book extends Media{
    isbn: number; /* todo: debatte if number or string, for 9-999-999 representation instead 999999 */
    author: string[];
    pages: number;
    tableOfContent?: string; //link to a picture of the page of content
}

// CD, DVD, Blu-ray
// Optional split this in more preceise categories i.e movies, music,..
export interface Disc extends Media{
    fsk?: number;
    contentLink?: string; //link to a picture of the page of content
    contentDuration?: number; //in minutes
    involvedPerson?: string[]; // singers, actors,...    
}

export interface digitalGame extends Media{
    developers: string[]; // in case multiple developers 
    usk: number;
    platforms: string[];
}

// No digital games, i.e card, boardgames,..
export interface Game extends Media{
    age?: number; //minimum advised age
    playTime?: number; //either in minutes or a string to handle later
    playersMinimum?: number; //minimum players needed
    playersMaximum?: number; //maximum players possible
}
export interface Magazine extends Media{
    issn: string; //string as the last number (#8) could also be a "X"
    articles?: string[];
    tableOfContentLink?: string; // link to a picture of the page of content
    magazineNumber?: number;
    pages?: number;
}
