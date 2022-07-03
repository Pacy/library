const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const borrowedMedia = require('../media/mediaUnitSchema');

const userSchema = new Schema({
    // omitting id field, so mongoDB auto generates a unique _id field that is a primary key

    firstName: { type: String, required: [true, "need a firs tname"] },
    lastName: { type: String, required: [true, "need a last name"] },
    birthday: { type: Date, required: [true, "need a birthday"] },
    email: { type: String, required: [true, "need an email adress"], unique: true }, // expect unique email, although what about child accounts? Who's email?
    phoneNumber: Number, // potentially same number for families

    city: { type: String, required: [true, "need a city"] },
    zipCode: Number,
    street: { type: String, required: [true, "need a street"] }, //including number

    password: { type: String, required: [true, "need a password"] },

    libraryCardNumber: {
        type: Number, index: {
            unique: true,
            partialFilterExpression: { libraryCardNumber: { $type: 'number' } },
        },
    },

    accessLevel: { type: Number, required: [true, "need user access level"] }, // 1 standard user, 2 library intern/helper, 3 library staff
    accountStatus: { type: Number, required: [true, "need account status"] }, // 0 inactive, 1 active, 2 

    overdueMedia: { type: Boolean, required: [true, "need over due information"] }, // if some medium have exceeded the return date
    loanFee: Number, // the amount of fees to pay, (if someone forgot to )

    valideTill: Date, // account valide till; inactive accounts do not have to have a date
    staffNote: String, // a little notebook about the user

    // borrowedMedia:  [{ type: Schema.Types.ObjectId, ref: 'MediaUnit' }] // reference to media borrowed by user, not existing yet

}, {
    // timestamps: true, // would include information when model was updated 
    collection: 'user'
});

module.exports = mongoose.model('User', userSchema);