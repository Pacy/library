const mongoose = require('mongoose');
let Schema = mongoose.Schema;


// Define collection and schema
let mediaUnitSchema = new Schema({
  mediaID: {type: mongoose.Schema.Types.ObjectId, ref:"Media" },
  mediaSignature: String,
  loanDuration: Number, //In days
  possibleExtensions: Number,
  loaned: Boolean,
  loanStartDay: Date,
  loanEndDay: Date,
  reservedBy:{type: mongoose.Schema.Types.ObjectId, ref:"User" }, // should refer User schema later
  loanedBy: {type: mongoose.Schema.Types.ObjectId, ref:"User" } // should refer User schema later
},{
  collection: 'mediaUnit'
})

module.exports = mongoose.model('MediaUnit', mediaUnitSchema)