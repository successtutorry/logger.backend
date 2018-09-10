const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactusSchema = new Schema({
	
	name: String,
	email: String,
	message: String,
	
}, {

	timestamps: { // this will give us the detail when the form was send.

		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});


const ContactusForm = mongoose.model('contactform', contactusSchema);
module.exports = ContactusForm;
