const express = require('express');
const app = express();
const mediaRoute = express.Router();

// Media model
const Media = require('./mediaSchema.js');
// need for unflatten function
var tools = require('../utility');


exports.getSearchResults = function (req, res, next) {
  console.log("getSearchResults", req.query)

  //unsure if needed the next two line, and if req.query is not fine enough
  const urlParams = new URLSearchParams(req.query);
  let params = Object.fromEntries(urlParams); // {abc.xy.t: "foo", def: "[asf]", xyz: "5"}
   console.log(params, "Params test")
   console.log(req.query)
  params = tools.unflattenObject(req.query)
  console.log(params, "unflatten")
  console.log(req.query.searchTerm1)

  let searchQuerry = createSearchQuerryObject(params);
  console.log("querry object", searchQuerry);
  // skipping search char (i.e *, ?) for the moment as priority is frontend
  Media.find(
     searchQuerry 
    , { title: 1, description: 1, releaseYear: 1, authors: 1, previewImageLink: 1, mediaType: 1 }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(201).json(data)
      }
    })
};

/**
 * 
 * Returns the request media from the "quick search" field using the $text index on the collection, sorted by media score
 */
exports.quickSearch = function (req, res, next){
  Media.find(
   { $text: {$search: req.query.searchTerm0}}
    , { title: 1, description: 1, releaseYear: 1, authors: 1, previewImageLink: 1, mediaType: 1 }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(201).json(data)
      }
    })
    .sort({ score: {$meta: "textScore"}})
    
};


exports.createMedia = function (req, res, next) {
  Media.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(201).json(data)
    }
  })
};

// returns a specific medium according to the requested id parameter sent
exports.getMedia = function (req, res, next) {
  console.log("getMedia", req.params)

  Media.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      if (data === null)
        // different opinions wether port 404 or 204 should be used for no result from a get querry
        res.status(404).send();
      else res.status(200).json(data);
    }
  })
};

exports.updateMedia = function (req, res, next) {
  Media.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Media successfully updated!')
    }
  })
};

exports.deleteMedia = function (req, res, next) {
  Media.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(204).send();
    }
  })
};

/**
 * 
 * @param obj unflatten( aka nested) object received from front-end, (can) contain specified fields mentioned in the example
 * @returns 
 * 
 * @example input format:
 * searchTerm0: { field: ".." , value: ".."},
 * searchTerm1: { field: "..", operator: '..', value: '..'  },
 * searchTerm2: { field: '..'  , operator: '..', value: '..'},
 * language: 'German',
 * genre: 'Art',
 * mediaType: 'Book'
 * 
 * 
 * TODO improves performance with creating indexes for this querry
 * TODO optional: change function so that it is more flexible, and not relying on specific elements format like this
 * TODO ? find a better approach for the nested if else statment
 *   --> (for next commit preferably) change order; instead of if2 ... if 1 ... if 0
 *        do if0 .. if 1 work with previous  ... if 2 work with previous. (if previous is empty than no problem)
 // TODO case insensitive: option 1) regex 2) create case insensitive index ----> used 1) for the moment, would affect performance on larger collections
 // TODO problem regarding "not" operator and "none" field selection. Not requires a field, therefore that search yields no good results
 */
function createSearchQuerryObject(obj) {
  
  str = JSON.stringify(obj, null, 4);
  console.log("Saaaaay: ", obj)
  // obj= 
  replaceStringSearchTermsWithRegex(obj);
  
  str = JSON.stringify(obj, null, 4);
  console.log("Sbbbbb: ", str)
  let result = {};

  // check if any combination of the three search fields is present
  let subQuery = {}; // array/object that contains the two/one sub Querries/-y for the operator (and,or,not)
  let objectKey;
  if (obj.hasOwnProperty('searchTerm2')) {
    if (obj.hasOwnProperty('searchTerm1')) {
      if (obj.hasOwnProperty('searchTerm0')) { // searchTerm 0,1,2 present
        objectKey = obj["searchTerm1"]["operator"] // used search operator (and,or,not)
        let searchQuerry1 = { [obj["searchTerm1"]["field"].toLowerCase()]: obj["searchTerm1"]["value"] }// : obj["searchTerm1"][objectKey] }
        let searchQuerry0 = { [obj["searchTerm0"]["field"].toLowerCase()]: obj["searchTerm0"]["value"] }//obj["searchTerm0"]
        subQuery = createLogicalOperatorQuery(objectKey, searchQuerry1, searchQuerry0)

        /**
         * 0,1 combined (1,2,3 present)
         * adding 2 to the search query
         */
        objectKey = obj["searchTerm2"]["operator"]//Object.keys(obj["searchTerm2"])[0]

        searchQuerry1 = { [obj["searchTerm2"]["field"].toLowerCase()]: obj["searchTerm2"]["value"] }//obj["searchTerm2"][objectKey]

        subQuery = createLogicalOperatorQuery(objectKey, searchQuerry1, subQuery)

      } else { //searchTerm 1,2 present
        objectKey = obj["searchTerm1"]["operator"]// Object.keys(obj["searchTerm1"])[0]
        let searchQuerry0 = { [obj["searchTerm1"]["field"].toLowerCase()]:obj["searchTerm1"]["value"] }//obj["searchTerm1"][objectKey]

        // searchTerm 0 was omitted, but have to check if operator is a $not
        if (objectKey === "not") {
          searchQuerry0 = createLogicalOperatorQuery(objectKey, searchQuerry0, {})
        }

        objectKey = obj["searchTerm2"]["operator"]// Object.keys(obj["searchTerm2"])[0]
        let searchQuerry1 = { [obj["searchTerm2"]["field"].toLowerCase()]: obj["searchTerm2"]["value"] }// obj["searchTerm2"][objectKey]


        subQuery = createLogicalOperatorQuery(objectKey, searchQuerry1, searchQuerry0)
      }
    } else if (obj.hasOwnProperty('searchTerm0')) { // searchTerm 0,2 present
      objectKey = obj["searchTerm2"]["operator"]// Object.keys(obj["searchTerm2"])[0]
      let searchQuerry1 = { [obj["searchTerm2"]["field"].toLowerCase()]: obj["searchTerm2"]["value"] }//obj["searchTerm2"][objectKey]
      let searchQuerry0 = { [obj["searchTerm0"]["field"].toLowerCase()]: obj["searchTerm0"]["value"] }//obj["searchTerm0"]

      subQuery = createLogicalOperatorQuery(objectKey, searchQuerry1, searchQuerry0)
    } else { //searchTerm 2 present
      objectKey = obj["searchTerm2"]["operator"]//Object.keys(obj["searchTerm2"])[0]
 
      subQuery[obj["searchTerm2"]["field"].toLowerCase()] = obj["searchTerm2"]["value"];

      // searchTerm 0,1 was omitted, but have to check if operator is a $not
      if (objectKey === "not")
        subQuery = createLogicalOperatorQuery(objectKey, subQuery, {})
    }
  } else if (obj.hasOwnProperty('searchTerm1')) {
    console.log("Inner 1")
    if (obj.hasOwnProperty('searchTerm0')) { // searchTerm 0,1 present

      objectKey = obj["searchTerm1"]["operator"]//Object.keys(obj["searchTerm1"])[0]
      let searchQuerry1 = { [obj["searchTerm1"]["field"].toLowerCase()]: obj["searchTerm1"]["value"] }//obj["searchTerm1"][objectKey]
      let searchQuerry0 = { [obj["searchTerm0"]["field"].toLowerCase()]: obj["searchTerm0"]["value"] }// obj["searchTerm0"]
      subQuery = createLogicalOperatorQuery(objectKey, searchQuerry1, searchQuerry0)

    } else { // searchTerm 1 present
      objectKey = obj["searchTerm1"]["operator"]// Object.keys(obj["searchTerm1"])[0]

      subQuery[obj["searchTerm1"]["field"].toLowerCase()] = obj["searchTerm1"]["value"];
      if (objectKey === "not")
        subQuery = createLogicalOperatorQuery(objectKey, subQuery, {})

    }
  } else if (obj.hasOwnProperty('searchTerm0')) { // searchTerm 0 present

    subQuery[obj["searchTerm0"]["field"].toLowerCase()] = obj["searchTerm0"]["value"];
  }
  result = subQuery;

  // for these unnested fields in the format {key: value} an array could be used, that is filtered based on keys existing in object be used and then fill the result
  if (obj.hasOwnProperty('language'))
    result["language"] = obj["language"]; // not working on db query. does not filter

  if (obj.hasOwnProperty('genre'))
    result["genre"] = obj["genre"];

  if (obj.hasOwnProperty('mediaType'))
    result["mediaType"] = obj["mediaType"];

  str = JSON.stringify(result, null, 4);
  console.log("Search Query: ", str)
  console.log("pree None keys", result)
  result=replaceNoneKeys(result);
  console.log("after None keys", result)

  console.log(result)
  return result;
}

/**
 * Create the mongodb search query for the input
 * 
 * @param {string} operator contains the string representation of a logical operator (and,or,not)
 * @param {*} object1 contains the first expression for the query
 * @param {*} object2 contains the second expression for the query, could be empty 
 * @returns return the object combining the input parameters according to the desired mongodb syntax
 */
function createLogicalOperatorQuery(operator, object1, object2) {

  // TODO check for errors 
  //if(Object.entries(object1).length > 0 ) // 2nd object can be empty
  console.log("case" , operator, object1, object2)
  switch (operator) {
    case "and": return createAndQuery(object1, object2);
    case "or": return createOrQuery(object1, object2);
    case "not": return createNotQuery(object1, object2);
  }
}

// TODO ? Do i really need an explicit "and" for all the cases?
//   according to some testing i would need an "and" with "not", but this is not handled by this function
//   removing explicit $and, also needs to take the values of obj1 and obj2 and put them in a single object
//     {ob1.key:ob1:value, ob2.key:ob2.value} instead of [obj1, obj2], this requires to verify that obj2 is not empty first as obj2 can be empty
//
// Return object, combining given objects by $and operator according to mongodb syntax
function createAndQuery(object1, object2) {
  let result = {};
  result["$and"] = [object1, object2];
  return result;
}

// Return object, combining given objects by $or operator according to mongodb syntax
function createOrQuery(object1, object2) {
  let result = {};
  result["$or"] = [object1, object2]; 
  return result;
}

/**
 * Returns an object combining the passed parameters
 * 
 * first object will be adjusted to the mongodb synatx for $not querries
 *    Syntax: { field: { $not: { <operator-expression> } } }
 *
 * then combined with $and with the second object 
 *      
 */
function createNotQuery(object1, object2) {
  let result = {};
  let notQuery = {};
  let notQueryArray = Object.entries(object1);
  // console.log("notQueryArray", notQueryArray)
  notQuery[notQueryArray[0][0]] = { "$not": new RegExp(notQueryArray[0][1], 'i')}// $not value has to be a regexp 
  result["$and"] = [notQuery, object2]
  return result;
}

/**
 * Replace none object keys by $text index search syntax for mongodb
 *  except when field is combined with not, as not requires a field
 * 
 *  general example {"none":"value"} by {$text:{$search: 'value'}
 */
function replaceNoneKeys(object1) {
  let result = {};
  for ( [key, value] of Object.entries(object1)) {
    // console.log("k-v",key,value)
    if(typeof value === "object" && Object.prototype.toString.call(value) === '[object Object]'){ //regexp are also objects, therefore the && part to filter them out
      // console.log("type object")
      value = replaceNoneKeys(value)
    }
    if(key === "none") { // check if none AND if there is not a "$not" used with it.
      if(Object.prototype.toString.call(value) === '[object Object]'&& Object.keys(Object.values(value)[0])[0] === "$not"){
        // console.log("none",Object.keys(Object.values(value)[0])[0])
        result[key]=value;
      }else{
        // console.log(" none => not $not")
        result["$text"]={}
        result["$text"]["$search"] = value;
      }
    }else{
      // console.log("! none")
      result[key]=value;
    }
  }
  // to do 
  // console.log("replaceNOneKeys", result)
  return result;
}

/**
 * Replace the given string in search terms field by regex expressions
 *   not the best approach to make case-insensitive search, because regex (like this) do not use indexes to improve search :(
 *   not going into perfomance improvement of this right now, as project focus was more on front-end than backend database performance 
 */
function replaceStringSearchTermsWithRegex (obj){
  if (obj.hasOwnProperty('searchTerm2')) {
    if(typeof obj["searchTerm2"]["value"] === 'string')
      obj["searchTerm2"]["value"]= new RegExp(obj["searchTerm2"]["value"], 'i');
  }
  if (obj.hasOwnProperty('searchTerm1')) {
    if(typeof obj["searchTerm1"]["value"] === 'string')
      obj["searchTerm1"]["value"]= new RegExp(obj["searchTerm1"]["value"], 'i');
  }
  if (obj.hasOwnProperty('searchTerm0')) {
    if(typeof obj["searchTerm0"]["value"] === 'string')
      obj["searchTerm0"]["value"]= new RegExp(obj["searchTerm0"]["value"], 'i');
  }
  // return obj; object is a refernce no return needed
}