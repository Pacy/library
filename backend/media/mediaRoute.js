const express = require('express');
const mediaController = require('./mediaController.js');

const router = express.Router();

router
  .route('/')
  .get(mediaController.getSearchResults)
  //toDo: protect so only inserts from authorize persons are possible
  .post(mediaController.createMedia);

router
  .route('/:id')
  .get(mediaController.getMedia)
   //toDo: protect so only updates from authorized persons are possible
  .put(mediaController.updateMedia)
  .delete(
    //toDo: protect so only deletion from authorized persons are possible
    mediaController.deleteMedia
  );


module.exports = router;