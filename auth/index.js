const session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      _ = require('lodash'),
      passport = require('passport'),
      Promise = require('bluebird'),
      mongoose = require('mongoose'),
      User = mongoose.model('User');

// promisify "User" and all instances of "User"
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = (app) => {
    // First, our session middleware will set/read sessions from the request.
    // Our sessions will get stored in Mongo using the same connection from
    // mongoose. Check out the sessions collection in your MongoCLI.
    app.use(session({
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24) // stores cookie for one day (so if they revisit they'll still be loggd in)
        },
        resave: false,
        saveUninitialized: false
    }));

    // Initialize passport and also allow it to read
    app.use(passport.initialize());

    // Read request session information.
    app.use(passport.session());

    // When we give a cookie to the browser, it is just the userId (encrypted with our secret).
    passport.serializeUser((user, done) => done(null, user._id));

    // When we receive a cookie from the browser, we use that id to set our req.user to a user found in the database.
    passport.deserializeUser((id, done) =>
      User.findByIdAsync(id)
        .then(user => done(null, user))
        .catch(err => console.log(err)));

    // Gets user off session if logged in
    app.get('/auth/session', (req, res) =>
        !req.user ?
        res.status(200).send('') :
        res.status(200).json(_.merge(_.omit(req.user.toObject(), ['password','salt']),{
          hasPassword: !!req.user.password
        }))
    );

    // Simple /logout route.
    app.get('/auth/logout', (req, res) => {
        req.session.destroy();
        res.status(200).end();
    });

    require('./local')(app);
    require('./google')(app);
    require('./facebook')(app);
};
