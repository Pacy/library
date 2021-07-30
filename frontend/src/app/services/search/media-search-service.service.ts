import { Injectable } from '@angular/core';
import { Media } from 'src/app/models/media';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';

@Injectable({
  providedIn: 'root'
})
export class MediaSearchService {

  constructor(
    private searchOption: mediaSearchOptions
  ) {
    //ToDO remove when server connection is established
    this.searchResult.push(this.media1, this.media2, this.media3, this.media4, this.media5)
  }

  //determine if user already used the search
  private searched = false;

  //used searchQuerry; probally not gonna use this (ToDO check if keep or delete)
  private searchedForString: string;

  private searchResult = new Array<Media>();
  //hardcoded example result. ToDo delete when server connection is established
  media1: Media = {
    id: 1, title: "harry potter and the Philo", mediaTyp: "Book", genre: "fantasy", releaseYear: 1997,
    description: "Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.Wikipedia"
  };
  media2: Media = { id: 2, title: "harry potter 2", mediaTyp: "Book", genre: "fantasy", releaseYear: 2020 };
  media3: Media = { id: 3, title: "harry potter 3", mediaTyp: "Book", genre: "fantasy" };
  media4: Media = { id: 4, title: "harry potter 4", mediaTyp: "Book", genre: "fantasy" };
  media5: Media = { id: 16, title: "harry potter 5", genre: "Fantasy", mediaTyp: "book" };


  // return the search results in an array
  getSearchResult() {
    return this.searchResult;
  }

  getMediumByID(i: number) { }

  getMediumExemplarByID(i: number) { }

  editMediumByID(i: number) { }

  editMediumExemplarByID(i: number) { }

  deleteMediumByID(i: number) { }

  deleteMediumExemplarByID(i: number) { }

  createMediumBy() { }

  createMediumExemplar() { }

  setSearched(b: boolean) {
    this.searched = b;
  }
  getSearched() {
    return this.searched;
  }

  searchFor(s) {
    //toDO check user input (security wise, not syntactic)
    this.setSearched(true);
    this.searchResult = this.getSearchResultFromServer(s);
    this.searchedForString = this.searchOption.getSearchedForString(s);
  }

  getSearchResultFromServer(s){
    //toDO backend request
    return this.searchResult;
  }

  getSearchedFor() {
    if (typeof this.searchedForString === 'undefined') {
      return "error: search string is undefined";
    } else if (this.searchedForString.length == 0) {
      return "the search string is empty";
    } else {
      return this.searchedForString;
    }
  }
}
