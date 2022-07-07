const express = require('express');
const app = express();
const userRoute = express.Router();


// for password saving
const bcrypt = require('bcrypt')
const saltRounds = 10 // increase this if you want more iterations


// User model
const User = require('./userSchema.js');

const jwt = require('jsonwebtoken');

// jwt token in here
const dataBaseConfig = require('.././config/config.js');
const jwtKey = dataBaseConfig.auth.jwtKey;



/**
 * ***********************************
 *  User authentification/authorization
 * ***********************************
 */

exports.login = function (req, res, next) {

    User.findOne({ "email": req.body["email"] }, { password: 1, lastName: 1, accessLevel: 1, }, (error, data) => {
        let user;

        if (error) {
            //console.log("Error on login: ", error);
            return next({ statusCode: 503, message: "Error reaching database" });
        } else {
            if (data == null) {
                // toDo: check if a server should use some "fake" value and continue to give potential attacker no/less potential for a "timing attack". Unsure because server has to be accessed and delay over network.
                // although, if plan is preveneting a timing attack there may be other suitable options. Keeping this for now in here
                user = { password: "1" };
            } else {
                user = ({ ...data }._doc); // copy of the data, to remove the password hash value later
            }
        }

        bcrypt.compare(req.body["password"], user["password"], function (err, result) {
            if (err) {
                return next(err);
            } else {
                // result == true, if the entered password matches the password hash
                if (result) {
                    delete user["password"]; // remove the password key:value pair from object to be returned to the front end

                    const tokenExpireTime = "1d";

                    // create jwt token, see more https://github.com/auth0/node-jsonwebtoken
                    // toDO? default alg is HS256, may switch to RS256 -have to look up on this though
                    const jwtBearerToken = jwt.sign(user, jwtKey, {
                        expiresIn: tokenExpireTime,
                    });

                    return res.status(200).json({
                        idToken: jwtBearerToken,
                        expiresIn: tokenExpireTime,
                        accessLevel: user["accessLevel"] // to simplify frontend accessLevel. Does not matter if compromised as the accessLevel will be checked on server side before sending data
                    });
                } else {
                    // toDO? delaying for a random time (around the average of the other if/else path) would be nice to reduce "timing attack" surface
                    return next({ statusCode: 401, message: "Unauthorized. The entered credential do not match any user" });
                }
            }
        });
    })
}


exports.authenticateToken = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return next({ statusCode: 401, message: "Unauthorized. No authentication receieved" });
    }
    jwt.verify(token, jwtKey, (err, user) => {
        if (err)
            next({ statusCode: 403, message: "Forbidden (authentification may have expired. Try to relogin)" });
        else {
            req.user = user;
            next(); // continue with the next method (should be the actual requested crud opertation)
        }
    })
}

/**
 * ***********************************
 *  Database CRUD Operation
 * ***********************************
 */


/**
 * Retrieve a list of all user if the requester is not a standard user. Otherwise return an error 
 * 
 * @returns a list of all user
 * 
 */
exports.getUserList = function (req, res, next) {
    if (req.user["accessLevel"] == 1) // no standard user should be able to access the list
        return next({ statusCode: 403, message: "You do not have the rights to see this page" });

    User.find({}, { lastName: 1, email: 1, loanFee: 1 }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).json(data);
        }
    })
}

// (try to) create new User entry in database
exports.createUser = function (req, res, next) {

    bcrypt.hash(req.body["password"], saltRounds, function (err, hash) {

        req.body["password"] = hash; // store password hash in the database instead of the password

        User.create(req.body, (error, data) => {
            if (error) {
                return next(error);
            } else {
                delete data._doc.password; // remove password hash from the data sent to the user
                return res.status(201).json(data);
            }
        })

    });
};

// (try to) get a specific User entry from database
// todo: have to distinguish between user(himself) and staff requesting the data
exports.getUser = function (req, res, next) {
    User.findById(req.params.id,
        { password:0, overdueMedia:0, loanFee:0, valideTill:0 } // data to be returned
        , (error, data) => {
            if (error) {
                return next(error);
            } else {
                if (data === null)
                    // different opinions wether port 404 or 204 should be used for no result from a get query
                    return res.status(204).send();
                else {
                    return res.status(200).json(data);
                }
            }
        })
};

// (try to) update an exisiting User entry in database
exports.updateUser = function (req, res, next) {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            return res.json(data); //toDo: return new data instead of the old retrieve one?
        }
    })
};

// (try to) delete an exisiting User entry in database
exports.deleteUser = function (req, res, next) {
    User.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            return res.status(204).send();
        }
    })
};
