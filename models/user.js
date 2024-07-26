const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); //passport-local-mongoose usage

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,  //storing email in schema
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //using passport local, it add username, password and also other methods

module.exports = mongoose.model('User', UserSchema);//exporting this schema as 'User'