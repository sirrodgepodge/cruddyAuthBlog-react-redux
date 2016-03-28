const passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      _ = require('lodash');


module.exports = function (app) {

    const googleCredentials = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    function verifyCallback(accessToken, refreshToken, profile, done) {
        User.findOneAsync({
                'email': profile.emails[0].value
            })
            .then((user) => {
                if(user && user.google._id) return Promise.resolve(user); // no need to fill in info w/profile if user already has Google log-in
                user = user || new User();
                user = _.merge(user, { // use Google profile to fill out user info if it does not already exist
                    email: user.email || profile.emails[0].value,
                    // firstName: user.firstName || profile.name.givenName,
                    // lastName: user.lastName || profile.name.familyName,
                    google: {
                      _id: profile.id,
                      photo: profile._json.image.url,
                      link: profile._json.url
                    }
                });
                return user.save();
            })
            .then((user) => done(null, user))
            .catch((err) => console.error('Error creating user from Google authentication', err) || done(err, null));
    }

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/');
        });

};
