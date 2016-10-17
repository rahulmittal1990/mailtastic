//var cluster = require('cluster');
config = require('./config/config.js');



//LOGGING

require( "console-stamp" )( console, {
    metadata: function () {
        return ("[" + process.memoryUsage().rss + "]");
    },
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }
} );



express = require('express');
require('./helpers/helperfunctions');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');		//um die requestdaten zu parsen
// var mongoose = require('mongoose');				//db Treiber
Sequelize =  require('sequelize');
var routes = require('./routes/index');			//routen

Intercom = require('intercom-client');
intercomClient = new Intercom.Client(config.intercomAppID, config.intercomApiKey);


var http = require('http');         //server soll sowohl https als auch http unterstützen
var https = require('https');       //server soll sowohl https als auch http unterstützen


						//port
var fs = require('fs');
app = express();							//express
var db = require('./model/db');					//connected zur DB
var modRewrite = require('connect-modrewrite');
//var timeMeasureMiddleware = require('./helpers/timemeasureing');	
//app.use(timeMeasureMiddleware);

// view engine setup
app.set('views', path.join(__dirname, 'views'));		//views werden nicht gebraucht da REST API
app.set('view engine', 'jade');

app.set('superSecret', config.secret); // secret variable
jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






/**
 * Middleware for jsonp request header origin
 */
app.use(function (req, res, next) {


    //checkOrigin
    var referer = req.headers.referer;
    var origin  = req.headers.origin;
    
    
    
    if(config.env === "amazon"){
         res.setHeader('Access-Control-Allow-Origin', "*" );
        
    }else if((referer === (config.website + "/")) || (referer === (config.website)) || (origin === (config.website + "/")) || (origin === (config.website))){
         // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', config.website );
        
    }else{
         // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', config.webapphost  );
        
    }
    
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Access-Control-Allow-Headers, If-Modified-Since');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.use(timeMeasureMiddleware());


var port = 3333;
/**
 * rewrite requests for pics and images   NOT NEEDED  SHOULD USE NORMAL ROUTE IN THE FUTURE
 */
app.use(modRewrite([
    '^/im/(.*)/ad /picserve/neu/$1',
    '^/li/(.*) /linkserve/neu/$1',
  ]));

if(config.env  === "amazon"){
    http.createServer(app).listen(process.env.PORT || 3000, function(){
    console.log('The server is running without ssl, ' +
    ' please open your browser at https://localhost:%s',
     port);
});

}else if(config.env  === "local"){
   
     http.createServer(app).listen(3333,function(){
         console.log('The server is running without ssl, ' +
        ' please open your browser at https://localhost:%s',
     port);
        
    });
   
    
}else if(config.env  === "production"){
     //in production it has to be available over http(Port 3334) and over https(Port 3333) 
    
     http.createServer(app).listen(3334,function(){
         console.log('The server is running without ssl, ' +
        ' please open your browser at https://localhost:%s',
     3334);
        
    });
    
    
    https.createServer({
      ca: fs.readFileSync('ssl/ca.crt'),
      key: fs.readFileSync('ssl/server.key'),
      cert: fs.readFileSync('ssl/cert.crt')
    
    }, app).listen(port, function(){
        console.log('The server is running with ssl, ' +
        ' please open your browser at https://localhost:%s',
     port);
    });
}






app.use('/account', require('./routes/authenticate'));
app.use('/picserve', require('./routes/picserve'));
app.use('/linkserve', require('./routes/linkserve'));
app.use('/refugees', require('./routes/refugees'));
app.use('/googleapi', require('./routes/googleapi'));
//app.use('/processimages', require('./routes/imageprocessor'));

require('./middleware/tokenvalidation');//FOR EVERY ROUTE AFTER THE NEXT ONE AUTHORIZATION IS NEEDED

app.use('/users', require('./routes/users'));
app.use('/campaigns', require('./routes/campaigns'));
app.use('/groups', require('./routes/groups'));
app.use('/employees', require('./routes/employees'));
app.use('/signatures', require('./routes/signatures'));
app.use('/googleSync', require('./routes/googleSync'));

//}

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
// });

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//   
//  console.log("500error: " . err.message);
//    res.status(err.status || 500);
// 
//    
//    // res.render('error', {
//      // message: err.message,
//      // error: err
//    // });
//  });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    console.log(JSON.stringify(err));
//  console.log("500error: " . err.message);
//    res.status(err.status || 500);
//
//});


// catch the uncaught errors that weren't wrapped in a domain or try catch statement
// do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.error("Uncaught Exception thrown:");
    console.trace(err);
    console.trace(err.stack);
});





module.exports = app;
