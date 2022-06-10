import { TestBed } from '@angular/core/testing';
// import { mediaSearchOptions } from 'src/app/models/meadia-search-options';
import { MediaHelper } from './media-helper';

fdescribe('MediaHelper', () => {
  let mediaHelper: MediaHelper;

  beforeEach(() =>{
    mediaHelper = new MediaHelper();
  })

  // not sure if instance tests should be kept
  it('should create an instance', () => {
    expect(mediaHelper).toBeTruthy();
  });

  // test is quite specific/fragile. If mediaType array changes somehow this has to be adapted
  // may have to drop it if it gets to problematic
  it(('getSvg should return the correct font awesome icon class'), () =>{
    const mediaTypes = ["-- All --", "Book", "CD / DVD / Blu-Ray", "electronical Game", "Game", "Magazine"];

    expect(mediaHelper.getSvg(mediaTypes[1])).toContain("book");
    expect(mediaHelper.getSvg(mediaTypes[2])).toContain("disc");
    expect(mediaHelper.getSvg(mediaTypes[3])).toContain("gamepad");
    expect(mediaHelper.getSvg(mediaTypes[4])).toContain("dice");
    expect(mediaHelper.getSvg(mediaTypes[5])).toContain("newspaper");
    
    expect(mediaHelper.getSvg(mediaTypes[0])).toContain("bug");
    expect(mediaHelper.getSvg("")).toContain("bug");
  });


  /**
   * ### getSearchForString() tests
   */
  it(("getSearchForString should return the values entered /quickSearch "), () =>{
    expect(mediaHelper.getSearchedForString({"searchTerm0": "1 + 2"})).toContain("1 + 2");
  })

  it(("getSearchForString should return the values entered"), () =>{
    const data = {
      searchTerm0: "3",
      searchField0: "-- All --",
      searchTerm1: "Harry",
      searchField1: "Fantasy",
      searchOperator1: "or",
      searchTerm2: "Peter",
      searchField2: "Roman",
      searchOperator2: "and",
      language: "English"
    }
    const result = mediaHelper.getSearchedForString(data);
    const regexp = /3.*or.*Harry.*Fantasy.*and.*Peter.*Roman.*.*English/;
    expect(result).toMatch(regexp);
  })

  it(("getSearchForString should not return the no-restriction field in the string"), () =>{
    const data = {
      searchTerm0: "3",
      searchField0: "-- All --",
      searchTerm1: "Harry",
      searchField1: "-- All --",
      searchOperator1: "Or",
      searchTerm2: "Harry",
      searchField2: "-- All --",
      searchOperator2: "Or"
    }
    const result = mediaHelper.getSearchedForString(data);
    const regexp = /(?!All)/;
    expect(result).toMatch(regexp);
  })
  
  
  it(("getSearchForString should return the error msg"), () =>{
    expect(mediaHelper.getSearchedForString("")).toContain("error");
  })


  /**
   * simplifySearchObject() tests
   */
   
   it(("simplifySeachObject should return the values entered and match the desired form /quick search"), () =>{
    const data={ searchTerm0: "Harry"};
    const result = mediaHelper.simplifySearchObject(data);
    const expectedObject = { searchTerm0: {
      value: "Harry",
      field: "none"
    }};
   expect(result).toEqual(expectedObject);
 })
 
  it(("simplifySeachObject should remove parts that are not used /extended search"), () =>{
     const emptyObject={}
    expect(mediaHelper.simplifySearchObject(emptyObject)).toEqual({});

    const data ={
      "searchField0": "No restriction",
      "searchTerm0": "",
      "searchOperator1": "and",
      "searchField1": "Author",
      "searchTerm1": "",
      "searchOperator2": "and",
      "searchField2": "Publisher",
      "searchTerm2": "",
      "language": "-- All --",
      "genre": "-- All --",
      "mediaType": "-- All --"
  };

    expect(mediaHelper.simplifySearchObject(data)).toEqual({});
  })

  it(("simplifySeachObject should return all the information of the parts that are used"), () =>{
    const emptyObject={}
   expect(mediaHelper.simplifySearchObject(emptyObject)).toEqual({});

   const data ={
     "searchField0": "No restriction",
     "searchTerm0": "a",
     "searchOperator1": "and",
     "searchField1": "Authors",
     "searchTerm1": "Babba",
     "searchOperator2": "or",
     "searchField2": "Publisher",
     "searchTerm2": "C",
     "language": "English",
     "genre": "Fantasy",
     "mediaType": "Book"
 };

 
 const expectedObject ={
   searchTerm0:{
     field: "set-it-after-to-avoid-being-to-fragile-test",
     value: "a"
   },
   searchTerm1:{
     operator:"and",
     field:"set-it-after",
     value: "Babba"
   },
   searchTerm2:{
     operator:"or",
     field:"set-it-after",
     value:"C"
   },
   language: "English",
   genre: "Fantasy",
   mediaType: "Book"
};

// set field values (like the method does) via an object to cast front-end name to backend-ones
const castingObject = mediaHelper.getFrontToBackendNames();
expectedObject.searchTerm0.field = castingObject[data.searchField0];
expectedObject.searchTerm1.field = castingObject[data.searchField1];
expectedObject.searchTerm2.field = castingObject[data.searchField2];

   expect(mediaHelper.simplifySearchObject(data)).toEqual(expectedObject);
 })


 /**
  * flattenObjectKeepInformation() test
  */
 it(("flattenObject should retain the nested information in the object"), () =>{
  const data = {
    array: ["val1","val2"],
    nestedObj: {
      keyA: "valA",
      keyB: "valB"
    },
    keyTop: "valTop"
  }
  const result = mediaHelper.flattenObjectKeepInformation(data);
  const expectedObject = {
    "array.0": "val1",
    "array.1": "val2",
    "nestedObj.keyA": "valA",
    "nestedObj.keyB": "valB",
    "keyTop": "valTop"
  }

  expect(result).toEqual(expectedObject)
 })


 /**
  * flattenObjectLoseInformation() test
  */
  it(("flattenObject should NOT retain the nested information in the object"), () =>{
    const data = {
      array: ["val1","val2"],
      nestedObj: {
        keyA: "valA",
        keyB: "valB"
      },
      keyTop: "valTop"
    }
    const result = mediaHelper.flattenObjectLoseInformation(data);
    const expectedObject = {
      "array": ["val1","val2"],
      "keyA": "valA",
      "keyB": "valB",
      "keyTop": "valTop"
    }
  
    expect(result).toEqual(expectedObject)
   })
  

});
