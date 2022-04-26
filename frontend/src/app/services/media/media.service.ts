import { Injectable } from '@angular/core';
import {Book, Disc, digitalGame,Magazine, Game, Media } from 'src/app/models/media';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';

import { Observable, of, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { AppSettings } from 'src/appSetting';
import { catchError, map , share} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MediaService {
  
  endpoint = AppSettings.api + "/media";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
// const headers = new HttpHeaders().append('header', 'value');


  constructor(
    private searchOption: mediaSearchOptions,
    private http: HttpClient
  ) {}

  //determine if user already used the search
  private searched = false;

  //used searchQuerry; probally not gonna use this (ToDO check if keep or delete)
  private searchedForString: string;

  searchResult = new Array<Media>();
  //hardcoded example result. ToDo delete when server connection is established
  // media1: Media = {
  //   id: 1, title: "harry potter and the Philo", mediaTyp: "Book", genre: "fantasy", releaseYear: 1997,
  //   description: "Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.Wikipedia"
  // };
  // media2: Media = { id: 2, title: "harry potter 2", mediaTyp: "Book", genre: "fantasy", releaseYear: 2020 };
  // media3: Media = { id: 3, title: "harry potter 3", mediaTyp: "Book", genre: "fantasy" };
  // media4: Media = { id: 4, title: "harry potter 4", mediaTyp: "Book", genre: "fantasy" };
  // media5: Media = { id: 16, title: "harry potter 5", genre: "Fantasy", mediaTyp: "book" };

  //toDo remove later, when backend connection is established
  // book1: Book = { id: 2, title: "harry potter 2", mediaTyp: "Book", genre: "fantasy",
  //  releaseYear: 2020, isbn: 213213, authors: ["Jk Rowling"], pages: 600 };
  //  book2: Book = { id: 1, title: "Harry Potter and the Philosopher Stone", mediaTyp: "Book", genre: "Fantasy",
  //  releaseYear: 1997, isbn: 747532699, authors: ["Jk Rowling","Ghost"], pages: 223 , language:"english", description:"Harry Potter is an ordinary boy living with his hostile relatives the Dursleys. He is later visited by a mysterious stranger named Rubeus Hagrid that he is famous for having survived an attack by the evil Lord Voldemort, that killed his parents, as a baby, and that he is the one chosen to defeat him. The film is known as Harry Potter and the Sorcerer's Stone in North America & India.", tableOfContentLink:"https://www.google.de",
  //  previewImageLink:"https://books.google.de/books/content?id=XtekEncdTZcC&printsec=frontcover&img=1&zoom=5&edge=curl", externalProductLink:"https://www.google.de/books/edition/Harry_Potter_und_der_Stein_der_Weisen/XtekEncdTZcC?hl=de&gbpv=0"};

  //  cd1: Disc = { id: 3, title: "audio book hp1", releaseYear: 2010, mediaTyp:"CD / DVD / Blu-Ray",previewImageLink:"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wallpapersafari.com%2F14%2F18%2FXzO4eC.jpg&f=1&nofb=1" }; //large image test
  //  cd2: Disc = { id: 4, title: "audio book hp2", description:"the audio book for the second book in the famous harry potter serious. Read by stephen fry",
  //   releaseYear: 2010, mediaTyp:"CD, DVD, Blu-ray", tableOfContentLink: "google.de", duration:600, involvedPerson: ["stephen fry"]};

  //   game1: digitalGame ={ id:3, title:"super mario", language:"german", usk: 6, developers:["Nintendo"], platforms:["snes"], mediaTyp:"electronical Game"};
  //   boardGame1: Game = {id:3, title: "monopoly", playTime:60, playersMaximum:6, playersMinimum: 2, mediaTyp:"Game"};
  //   magazine1: Magazine= {id: 4, title:"asjdw dsfi asdfsj", language:"english", mediaTyp:"Magazine", issn:"1234 567X", pages:100};
    
  //   arraycollection= [this.book1,this.book2,this.cd1,this.cd2,this.game1,this.boardGame1,this.magazine1];

    subject$ = new Subject();


  // return the search results in an array
  getSearchResult() {
    console.log("getSearchResult", this.searchResult)
    return this.searchResult;
  }

  getMediumByID(i: number) {  //todo obsolete method. remove calls to this method
    //toDO backend request
    if (i>=0 && i< this.searchResult.length)
    return this.searchResult[i-1];
    else
    return "error gettingMediumID";
  }


  getMediumExemplarByID(id): Observable<any> {
    let apiUrl= `${this.endpoint}/${id}`;
    return this.http.get(apiUrl,{ headers: this.headers})
    .pipe(
      share(), //todo check if still needed actually
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
   }

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
   this.getSearchResultFromServer(s)
   .subscribe((result: Media[]) => {
    this.searchResult = result;
     this.subject$.next(this.searchResult)
  },
  error => console.log(error)
)

    this.searchedForString = this.searchOption.getSearchedForString(s); 
  }

  getData(): Observable<any> {
    return this.subject$.asObservable();
}
quickSearch(s):Observable<Media[]>{
    let queryParameter = this.searchOption.flattenObject(s)
    queryParameter = new URLSearchParams(queryParameter).toString();

    let apiUrl = `${this.endpoint}/quickSearch?${queryParameter}`;

    console.log("url", apiUrl)
    return this.http.get<Media[]>(apiUrl)//, {headers: this.headers,  params: paramss})
     .pipe(
       catchError(this.handleError)
     )
}

  getSearchResultFromServer(s):Observable<Media[]>{

    let simplifiedData = this.searchOption.simplifySearchObject(s);
    let queryParameter = this.searchOption.flattenObject(simplifiedData)
    queryParameter = new URLSearchParams(queryParameter).toString();

    let apiUrl = `${this.endpoint}?${queryParameter}`;

    console.log("url", apiUrl)
    return this.http.get<Media[]>(apiUrl)//, {headers: this.headers,  params: paramss})
     .pipe(
       catchError(this.handleError)
     )
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
  getAllCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>('http://localhost:3000/api/cats')
  }
  // GetMedias() {
  //   return this.http.get(`${this.endpoint}`);
  // }
  getCat(name: string): Observable<Cat> {
    let r= "rrr";
    this.http.get<Cat>('http://localhost:3000/api/cats/' + r)
    .subscribe((res) => {
      console.log(res, "getCat +id")
    })
    return null;
  }

  insertCat(r): Observable<Cat> {
    console.log("Insert called",r),
    this.http.post<Cat[]>('http://localhost:3000/api/cats/', new Cat("rrr"))
    .subscribe((res) =>{
      console.log(res);
      console.log("test2,2")
  });
    return this.http.post<Cat>('http://localhost:3000/api/cats/',r)
  }

  updateCat(cat: Cat): Observable<void> {

   this.http.put<void>( 'http://localhost:3000/api/cats/' + "rrr","ccc")
   .subscribe((res)=>{
     console.log(res)
   })
    return null;
  }

  deleteCat(name: string) {
    return this.http.delete('http://localhost:3000/api/cats/' + "rrr")
    .subscribe((res)=>
    console.log(res)
    )
  }
  editCat(name:string){
    
  }

  // Error handling 
 handleError(error: HttpErrorResponse) {
   console.log("handle error")
  let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
        window.alert(errorMessage);
      } 
      console.log(errorMessage);
      return throwError(errorMessage);
 }
}

export class Cat {
  name: string
  constructor(r){
    this.name=r;
  }

  
 
  
} 
