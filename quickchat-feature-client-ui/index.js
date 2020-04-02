const port = process.env.PORT || 3000,
      sockets = require('./core/sockets'),
      session = sockets.session,
      bodyParser = require('body-parser'),
      app = sockets.app,
      server = sockets.server,
      express = sockets.express,
      path = require('path'),
      pageRouters = require('./routes/routers');

// for body parser. to collect data that sent from the client.
app.use(express.urlencoded( { extended : false}));
app.use(bodyParser.json());

// Serve static files. CSS, Images, JS files ... etc
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(session({
//     secret:'chat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 24 * 3600000
//     }
// }));

//getting rid of the slash at the end
app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
      res.redirect(301, req.url.slice(0, -1));
    else
      next();
  });

// Routers
app.use('/', pageRouters);

server.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});