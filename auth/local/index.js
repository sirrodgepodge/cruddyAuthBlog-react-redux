'use strict';
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    function strategyFn(email, password, done) {
        User.findOne({ email: email })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            }, function (err) {
                done(err);
            });
    }


    // A POST /login route is created to handle login.
    app.post('/auth/login', function (req, res, next) {

        passport.authenticate('local', authCb)(req, res, next);

        function authCb(err, user) {
            if (err) return next(err);

            // since this is a silly example, if the user's login credentials don't match any users we just create a new user
            if (!user) {
                User.findOneAsync({ 'email': req.body.email })
                    .then(foundUser => {
                      if(foundUser) {
                        console.log('adding password to existing user');
                        foundUser.password = req.body.password;
                        return foundUser.saveAsync();
                      } else {
                        console.log('creating new user');
                        return (new User(req.body)).saveAsync();
                      }
                    }).then(storedUser => {
                      res.status(200).json(_.merge(_.omit((storedUser[0] || storedUser).toObject(), ['password','salt']),{
                        hasPassword: true
                      }));
                    });

                    //// what we'd do normally is commented out here
                    // var error = new Error('Invalid login credentials.');
                    // error.status = 401;
                    // return next(error);
            } else {
                console.log('found existing user');
                // req.logIn will establish our session.
                req.logIn(user, loginErr => {
                    if (loginErr) return next(loginErr);
                    // We respond with a response object that has user with _id and email.
                    res.status(200).json(_.merge(_.omit(req.user.toObject(), ['password','salt']),{
                      hasPassword: !!req.user.password
                    }));
                });
            }
        }
    });


    //// normally we'd have a separate sign up route
    // A POST /signup route is created to handle signup.
    // app.post('/auth/signup', (req, res, next) =>
    //     User.findOne({ email: req.body.email })
    //         .then(foundUser => foundUser ?
    //             Promise.reject(new Error('User Already Exists')) :
    //             (new User(req.body)).save())
    //         .then(storedUser => req.logIn(storedUser, loginErr => {
    //                 if (loginErr) return next(loginErr);
    //                 // We respond with a response object that has user with _id and email.
    //                 res.status(200).send({
    //                     user: _.omit(storedUser, ['password', 'salt'])
    //                 });
    //             }))
    //         .catch(err => {
    //           err.status = 401;
    //           next(err);
    //         }));

};
