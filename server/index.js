      //Express and Express middlewares
const express = require('express'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      path = require('path'), // handles smooth joining of file paths (inserts slashes where needed, prevents double slashes)
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      favicon = require('serve-favicon'),
      cors = require('cors'),

      // environmental variable importing
      dotenv = require('dotenv'),

      // Webpack imports
      webpack = require('webpack'),
      config = require('../webpack.config.dev'),
      webpackDevMiddleware = require('webpack-dev-middleware'),
      webpackHotMiddleware = require('webpack-hot-middleware');


// Grabs key-value pairs from ".env" folder and sets keys as properties on "process.env" object accessable anywhere in the app
dotenv.config();


// Express needs to be instantiated, it's possible to run multiple Express instances in the same node app and have them listen on different ports
const app = express(),
      serverPort = process.env.PORT || 3000; // If port has been provided by environmental variables use that, else defauly to 3000


// Runs React-hot-loader via our webpack dev configuration if in dev mode
if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath })); // noInfo flag prevents webpacks (verbose) default console logs and only logs errors and warnings
  app.use(webpackHotMiddleware(compiler));
}


// Request parsing middleware
app.use(bodyParser.json()); // allows request body parsing
app.use(bodyParser.urlencoded({ extended: false })); // allows request query string parsing, extended : false means query string values cannot contain JSON (must be simple key-value)
app.use(cookieParser()); // allows cookie parsing (cookies are simple key value stores in the browser)


// Allow CORS (this allows you to serve assets, images for example, from other domains)
app.use(cors());


// gzips (technically compresses with zlib) responses to HTTP requests
app.use(compression());


// app root folder path
const root = path.resolve(__dirname, '..');  // __dirname is a global variable available in any file and refers to that file's directory path


// used to set favicon (little image next to page title in browser tab)
app.use(favicon(path.join(root, 'public', 'favicon.ico')));


// Set static folder
app.use(express.static(path.join(root, 'public')));


// Log requests to console
if(process.env.NODE_ENV !== 'production')
  app.use(logger('dev'));


const startDbPromise = require(path.join(root,'db'))(process.env.DATABASE_URI);

startDbPromise.then(() => {
  // Bring in API routes from crud folder
  app.use('/api', require(path.join(root, 'crud'))); //// Note that we do not need to specify "index.js" inside of the "crud" folder, if file is unspecified "index.js" is default when folder is required

  // Bring in Auth routes from auth folder (must feed in app as middlewares are added at this step)
  require(path.join(root, 'auth'))(app);

  // Serve index.html from root
  app.get('/', (req, res, next) => res.sendFile('/index.html', {
    root: path.join(root, 'public')
  }));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Handle route errors
  app.use((err, req, res, next) => {
    console.error(err); // log to back end console
    res.status(err.status || 500);
    res.send(err.message); // send error message text to front end
  });

  // Launch server on port
  app.listen(serverPort, (err, res) => err ?
    handleError(err) :
    console.log(`app served on port ${serverPort}`));
})
.catch(err => console.log(err));


// Note that I can define "handleError" down here and use it above, this is because "declarations" are hoisted in Javascript (can only be done with functions created with this syntax though)
function handleError(err){
  switch (err.code) {
    case 'EACCES':
      console.error(`port ${serverPort} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`port ${serverPort} is already in use`);
      process.exit(1);
      break;
    default:
      console.log(err);
      process.exit(1);
  }
}
