export interface User {
	_id: number;
    firstName: String,
    lastName: String,
    birthday: Date,
    email: String,
    phoneNumber: Number,

    city: String,
    zipCode: Number,
    street: String, 
    
    libraryCardNumber: Number, 

    accessLevel: Number,  // 1 standard user, 2 library intern/helper, 3 library staff, (4 library admin)
    accountStatus: Number, // 0 inactive, 1 active, 2 

    overdueMedia: Boolean, // if some medium have exceeded the return date
    loanFee: Number,// the amount of fees to pay, (if someone forgot to )

    valideTill: Date, // account valide till; inactive accounts do not have to have a date
    staffNote: String, // a little notebook about the user

    // borrowedMedia:  MediaUnits[] // reference to media borrowed by user
}