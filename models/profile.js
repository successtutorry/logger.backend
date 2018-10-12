const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({

	user: {type: Schema.Types.ObjectId, ref: 'User'},
  age:String
});

// exporting the user so that it can be used wherever required
const Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;
