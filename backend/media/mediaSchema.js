/**
 * Project was planned as Mean Stack Application, therefore going with Mongodb as server.
 * 
 * Otherwise SQL vs NOSQL would have to be decided
 * and normalised regardingly if sql
 * 
 * As the different media (irrelevant of type) are accessed together in a general search,
 * and on a look up on a specific id the different data of a row is retrieve;
 *      therefore the data will be stored in a big schema for now.
 *  
 * Have to check if this is really the best way for this way of the data usage at a later point,
 * but FOCUS of the application was actually in the front-end anyway.
 * 
 * Alternative, give every media type its own schema to reduce empty fields and a large table, and
 * perform the search querry in each table and return the combination of them.
 * 
 * Skiped the index on schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema
const mediaSchema = new Schema({
  // properties for every object
  // omitting id field, so mongoDB auto generates a unique _id field that is a primary key, in case there is no ean
  ean: {type: Number, unique:true, sparse :true},
  title: {type:String, required:true},
  releaseYear: Number,
  publisher: [String],
  description: String,
  genre: String,
  mediaType: String,
  language: String,
  //currently obsolete, as it is not used tags: [String],
  previewImageLink: String,
  externalProductLink: String,
  // properties of the different mediatypes
  //      read comment on top for why the table will have a bunch of blank fields at the moment
  //book properties
  // isbn: Number, // same number as ean, therefore can removed here
  authors: [{type:String}],
  pages: Number, // property also for a magazine
  tableOfContentLink: String, // property for books, magazine, (Disc)
  // CD, DVD, Blu-Ray
  fsk: Number,
  duration: Number,
  involvedPerson: [String],
  // digitalGame
  developers: [String],
  usk: Number,
  platforms: String, // not an array, because different platform have also different ean. Which means it has to be a seperate entry
  // Games
  minAge: Number,
  playTime: Number,
  playersMinimum: Number,
  playersMaximum: Number,
  // magazine
  issn: Number,
  magazineNumber: Number,
},{
  collection: 'media'
})

module.exports = mongoose.model('Media', mediaSchema)
