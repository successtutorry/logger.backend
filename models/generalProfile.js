const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({

	firstname: String,
	lastname: String,
	address1: String,
	address2: String,
	address3: String,
	zipcode: String,
	mobileno: String,
    email: String
	

}, {

	timestamps: { // this will give us the detail when the account is created

		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});



// exporting the user so that it can be used wherever required

const tutorProfile = mongoose.model('profiles', profileSchema);

module.exports = tutorProfile;

