var mongoose = require('mongoose'),
    crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    salt: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    google: {
      _id: String,
      photo: String,
      link: String
    },
    facebook: {
      _id: String,
      photo: String,
      link: String
    }
});

// add password handling functions as methods on User schema
UserSchema.statics.hashPassword = hashPassword;

// add method on instances to check if password is correct
UserSchema.methods.correctPassword = function(password) {
  return !!this.salt && hashPassword(password, this.salt) === this.password;
};

// hashes password for secure storage
function hashPassword(plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
}

// combines above functions for password save and update handling
function handlePasswordChange(next) {
    if (this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64'); // generates a random string to be added to the user's password prior to hashing, an extra security measure
        this.password = this.constructor.hashPassword(this.password, this.salt);
    }
    next();
}

UserSchema.pre('save', handlePasswordChange);  // runs 'handlePasswordChange' prior to 'save' action
UserSchema.pre('update', handlePasswordChange);  // runs 'handlePasswordChange' prior to 'update' action

// set user schema on mongoose
mongoose.model('User', UserSchema);
