const express = require('express');
const userController = require('./userController.js');

const router = express.Router();

router
  .route('/')
  .get(userController.authenticateToken, userController.getUserList)
  //toDo: protect so only inserts from authorize persons are possible
  .post(userController.createUser);

router
  .route('/login')
  .post(userController.login);

router
  .route('/:id')
   //toDo: protect so only get from authorized persons are possible
  .get(userController.getUser)
   //toDo: protect so only updates from authorized persons are possible
  .put(userController.updateUser)
  .delete(
    //toDo: protect so only deletion from authorized persons are possible
    userController.deleteUser
  );


module.exports = router;