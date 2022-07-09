# Basic Library
A basic library web application (front- and backend)
Application is built with MEAN stack

>Basic library, is meant to handle the use cases of a library web application. This includes searching for medium they own, their availabilty, news from the library, checking borrow status own books.
>Furthermore, the idea would be to extended with borrow/return functions to emulate a library interaction with medium and the user. 

## Project Status
Work in progress, so far working
- a basic 'home' page including some news (news are hardcoded at the moment)
- crud operation for media (front- & backend)
   - create with reactive form
   - read accesible via search (or url edit with the object id)
   - update uses the same reactive form as the create component
   - delete simple button with a modal for confirmation
- search for media with template driven form (supports a quick search field that return a weighted list, or an extended search form with and/not/or operator(s) and fields to search on)
- curd operation for user (backend & partially in frontend)
   - Create / update a user with reactive form
- authentification & authorization
   - compare user input with password hash in the database
   - create a jwt token with an expire time (currently no refresh token used)
   - using the jwt token for authorization


## Tech

Currently used :

- [MongoDB] - NoSQL Database
- [Angular] - client-side JavaScript framework
- [Express] - Node.js web framework
- [node.js] - JavaScript web server 

## Starting application
Currently used version:
- MongoDB 5.0.7
- Angular 13.3.1
- Express 4.17.3
- Node.js 14.15.0
( For a compatability list refer to this this [github compatability list] )


Clone this repository. Install the dependency (need npm for this)

``
npm install
``

Start mongoDB with mongod. 
(additional you can specify a database path
``
mongod --dbpath="D:\data\db"
`` )

> The "_other" folder contain a database dump called library.gz, to import this data create a databse in mongodb called "library2021"
> The dataset can then be import with 
``
mongorestore --gzip --archive=${PATH_TO_LIBRARY.GZ_FILE}
``
>This should include the dataset and all indexes

Both, front- and backend, can be started together from the folder containing both projects with
``
npm start
``
or by nagivating to them and then running the same command on each subfolder


## Reflection
This web application is meant to practice and improve my knowledge regarding building front and backend web application with the MEAN stack :)
Focus is actually on the front end, but backend logic and database take some time to get right. The whole project is built from scratch on my own.

The project is built on the go while trying to get more confindence in frontend developing skills.
Different challenges appeared when working on the project, and new things are learnt :)

For example that a monogDB index search combined with an $or operator, requires the other field to be indexed to work.


<!---
## License

MIT


**Free Software, Hell Yeah!**
--->

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO -  // created with https://dillinger.io/ // http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Angular]: <https://angular.io/>
   [MongoDB]: <https://www.mongodb.com/>
   [github compatability list]: <https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3>

