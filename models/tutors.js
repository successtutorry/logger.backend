const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
	
	price: String,
	email: String,
	name: String,
	subjects:String,
	location:String,
	imagePath:String

	
	
}, {

	timestamps: { // this will give us the detail when the form was send.

		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


const tutor = mongoose.model('tutors', tutorSchema);
module.exports = tutor;
