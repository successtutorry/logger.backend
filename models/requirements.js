const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');



const requirementSchema = new Schema({
	
	name: String,
	age: String,
	class: String,
	subject: String,
	email: String,
	location_preference: String,
	gender_preference: String,
	address: String,
	availabletime: String,
	description: String


	

}, {

	timestamps: { // this will give us the detail when the requiremnt is created

		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


const Requirement = mongoose.model('requirement', requirementSchema);
module.exports = Requirement;