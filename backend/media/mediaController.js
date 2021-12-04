const express = require('express');
const app = express();
const mediaRoute = express.Router();

// Media model
const Media = require('./mediaSchema.js');

exports.getSearchResults = function(req, res, next) {
  // skipping $or $and combination; search char (i.e *, ?) for the moment as prior is frontend
  Media.find({
    ...req.query.ean? {ean: req.query.ean} : {},
    ...req.query.title? {title: new RegExp(req.query.title,"i")} : {},
    ...req.query.releaseYear? {releaseYear: req.query.releaseYear} : {},
    ...req.query.publisher? {publisher: new RegExp(req.query.publisher,"i")} : {},
    ...req.query.genre? {genre: req.query.genre} : {},
    ...req.query.mediaType? {mediaType: req.query.mediaType } : {},
    ...req.query.isbn? {isbn: req.query.isbn } : {},
    ...req.query.issn? {issn: req.query.issn } : {},
    ...req.query.authors? {authors: new RegExp(req.query.authors,"i")} : {},
    // skipped varies attributes as they are not included in search.
    // skipping following attributes too for now
    // fsk: Number,
    // duration: Number,
    // involvedPerson: [String],
    // digitalGame
    // developers: [String],
    // usk: Number,
    // Games
    // minAge: Number,
    // playTime: Number,
    // playersMinimum: Number,
    // playersMaximum: Number,
    //   magazineNumber
  },{title:1, description:1, releaseYear:1}, (error, data) => {
    if (error) {
       return next(error)
    } else {
      res.status(201).json(data)
    }
  })
};


exports.createMedia= function(req, res,next) {
  Media.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(201).json(data)
    }
  })
};

exports.getMedia= function(req, res, next) {
  Media.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json(data)
    }
  })
};

exports.updateMedia= function(req, res, next) {
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

exports.deleteMedia= function(req, res, next) {
  Media.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(204).send();
    }
  })
};