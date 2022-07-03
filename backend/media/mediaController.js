const express = require('express');
const app = express();
const mediaRoute = express.Router();

// Media model
const Media = require('./mediaSchema.js');
// need for unflatten function
var tools = require('../utility');


exports.getSearchResults = function (req, res, next) {
  const params = tools.unflattenObject(req.query)
  const searchQuery = createSearchQueryObject(params);

  // skipping search char (i.e *, ?) for the moment as priority is actually frontend of the project
  Media.find(
    searchQuery
    , { title: 1, description: 1, releaseYear: 1, authors: 1, previewImageLink: 1, mediaType: 1 }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.status(201).json(data)
      }
    })
};

/**
 * 
 * Returns the request media from the "quick search" field using the $text index on the collection, sorted by media score
 */
exports.quickSearch = function (req, res, next) {
  Media.find(
    { $text: { $search: req.query.searchTerm0 } }
    , { title: 1, description: 1, releaseYear: 1, authors: 1, previewImageLink: 1, mediaType: 1 }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.status(201).json(data)
      }
    })
    .sort({ score: { $meta: "textScore" } })
};


exports.createMedia = function (req, res, next) {
  Media.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      return res.status(201).json(data)
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
      if (data === null) {
        // different opinions wether port 404 or 204 should be used for no result from a get query
        return res.status(404).send();
      }
      else {
        return res.status(200).json(data);
      }
    }
  })
};

exports.updateMedia = function (req, res, next) {
  Media.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log('Media successfully updated!')
      return res.json(data) //toDo: return new data instead of the old retrieve one?
    }
  })
};

exports.deleteMedia = function (req, res, next) {
  Media.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      return res.status(204).send();
    }
  })
};

/**
 * 
 * @param obj unflatten( aka nested) object received from front-end, (can) contain specified fields mentioned in the example
 * @returns an object in the proper syntax form for mongodb find()
 * 
 * @example input format:
 * searchTerm0: { field: ".." , value: ".."},
 * searchTerm1: { field: "..", operator: '..', value: '..'  },
 * searchTerm2: { field: '..'  , operator: '..', value: '..'},
 * language: 'German',
 * genre: 'Art',
 * mediaType: 'Book'
 * 
 * Note: Input element is changed. If desired to keep origin input untouched. Copy object received
 * TODO improves performance with creating indexes for this query
 * TODO case insensitive: option 1) regex 2) create case insensitive index ----> used 1) for the moment, would affect performance on larger collections
 */
function createSearchQueryObject(obj) {
  //alter given obj
  replaceStringSearchValueByRegexOrNumber(obj);
  replaceNoneKeys(obj);

  let result = {};
  let objectKey;

  // add searchTerm0 fields if existing to result
  if (obj.hasOwnProperty('searchTerm0')) {
    result[obj["searchTerm0"]["field"]] = obj["searchTerm0"]["value"];
  }
  const searchTerms = ["searchTerm1", "searchTerm2"];
  // add searchTerm 1&2 fields according syntax to result if they exist in the object received
  for (const sTerm of searchTerms) {
    if (obj.hasOwnProperty(sTerm)) {
      objectKey = obj[sTerm]["operator"]
      if (tools.objectIsEmpty(result)) { //check if result still empty  (aka if obj.hasOwnProperty('searchTerm0') exist)
        result[obj[sTerm]["field"]] = obj[sTerm]["value"];
        if (objectKey === "not") { // if operator is not create query, otherwise subQuery can stay like this
          result = createLogicalOperatorQuery(objectKey, result, {})
        }
      } else {
        let searchQuery1 = { [obj[sTerm]["field"]]: obj[sTerm]["value"] }
        result = createLogicalOperatorQuery(objectKey, searchQuery1, result)
      }
    }
  }

  // possible further search specifications from the front end
  const subSearchFields = ["language", "genre", "mediaType"]
  // add every existing further search field to the results
  for (const subField of subSearchFields) {
    if (obj.hasOwnProperty(subField))
      result[subField] = obj[subField];
  }

  return result;
}

/**
 * Create the mongodb search query for the input
 * 
 * @param {string} operator contains the string representation of a logical operator (and,or,not)
 * @param {*} object1 contains the first search expression for the query
 * @param {*} object2 contains the second search expression for the query, could be empty 
 * @returns return the object combining the input parameters according to the desired mongodb syntax
 */
function createLogicalOperatorQuery(operator, object1, object2) {

  // TODO check for errors 
  //if(Object.entries(object1).length > 0 ) // 2nd object can be empty
  switch (operator) {
    case "and": return createAndQuery(object1, object2);
    case "or": return createOrQuery(object1, object2);
    case "not": return createNotQuery(object1, object2);
  }
}
// explicit $and combination in this scenario only necessary for combination where obj1, and obj2 have the same "field" value.
//   otherwise result would be {obj1,obj2}
// TODO: figure out how much performance impact a "unecessary" explicit $and combination would have or if it does not matter
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
 * Returns an object in mongodb syntax combining obj1 and obj2 with and "$and", and negating first obj1**
 * 
 * **Note: a negated query has to have a field. if given field is "none", return obj2
 * 
 * first object will be adjusted to the mongodb synatx for $not queries
 *    Syntax: { field: { $not: { <operator-expression> } } }
 *      
 */
function createNotQuery(object1, object2) {
  const notQueryArray = Object.entries(object1).flat();
  let result = {};
  let notQuery = {};


  // check if value is a number // checking for number is here currently ok, as a we replacedString with regexp at the moment and cast numberfields to number
  // otherwise we would have to check for the number fields 
  if (typeof notQueryArray[1] === "number") {
    // if number is $ne operator instead, because $not does not accept numbers
    notQuery[notQueryArray[0]] = { "$ne": notQueryArray[1] }
  } else {
    notQuery[notQueryArray[0]] = { "$not": new RegExp(notQueryArray[1], 'i') }// $not value has to be a regexp 
  }
  result["$and"] = [notQuery, object2]
  return result;
}

/**
 * Replace "none" object key-value pairs by index search syntax for mongodb, if possible.
 *   $not can not be combined with "none" field, therefore they will be deleted (instead of throwing an error, so user can still get some search results)
 * 
 *  key-value pair with key="none", will be replaced by key="$text", the value="x" will be replaced by object={$search, x}
 * 
 *  general example: 
 *  obj.field = none -> $text
 *  obj.value = x -> {$search: x}
 */
function replaceNoneKeys(obj) {
  if (obj.hasOwnProperty('searchTerm0') && obj["searchTerm0"]["field"] === "none") { // could cast to lowerCase before string comparsion to ensure safety
    obj["searchTerm0"]["field"] = "$text";
    obj["searchTerm0"]["value"] = { "$search": obj["searchTerm0"]["value"] }
  }
  if (obj.hasOwnProperty('searchTerm1') && obj["searchTerm1"]["field"] === "none") {
    if (obj["searchTerm1"]["operator"] === "not") {
      delete obj["searchTerm1"];
    } else {
      obj["searchTerm1"]["field"] = "$text";
      obj["searchTerm1"]["value"] = { "$search": obj["searchTerm1"]["value"] }
    }
  }
  if (obj.hasOwnProperty('searchTerm2') && obj["searchTerm2"]["field"] === "none") {
    if (obj["searchTerm2"]["operator"] === "not") {
      delete obj["searchTerm2"];
    } else {
      obj["searchTerm2"]["field"] = "$text";
      obj["searchTerm2"]["value"] = { "$search": obj["searchTerm2"]["value"] }
    }
  }
}


/**
 * Replace the string value in the search terms by regex expressions or numbers according to database schema type for the field. 
 *  delete object property where number is expected, but got something else instead
 * 
 *   not the best approach to make case-insensitive search, because regex (like this) do not use indexes to improve search :(
 *   not going into perfomance improvement of this right now, as project focus was more on front-end than backend database performance 
 */
function replaceStringSearchValueByRegexOrNumber(obj) {

  // number fields, that are not used on the front end for search currently
  // ean, pages, fsk, duration, usk, minAge, playTime, playersMinimum, playersMaximum, issn, magazineNumber,
  const schemaTypeNumber = ["releaseYear", "isbn"];

  const propertyNames = ["searchTerm0", "searchTerm1", "searchTerm2"]
  for (const property of propertyNames) {
    if (obj.hasOwnProperty(property)) {
      if (!schemaTypeNumber.includes(obj[property]["field"])) {
        obj[property]["value"] = new RegExp(obj[property]["value"], 'i');
      } else if (tools.isNumber(obj[property]["value"])) { // 1st check to ensure it is a number, 2nd ensures that whitespace
        obj[property]["value"] = +obj[property]["value"]
      } else {
        // either: A) throw an error, that the number schema field does not contain a number value B) delete it, so that the search continues without it
        // A) would be better to do in the front end though
        delete obj[property];
      }
    }
  }
}