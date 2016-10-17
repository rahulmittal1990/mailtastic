

// route middleware to verify a token
app.use(function(req, res, next) {


var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
//console.log("Incoming connection from: " + ip);
var ref = req.headers.referer;
//console.log("Incoming request from refferer: " + ref);
var origin=req.headers.origin;
//console.log("Incoming request from origin: " + origin);


if(req.method == "OPTIONS"){
	//hier ist noch kein token drin
	next();
}else{
	 // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
        if (err) {
             return res.status(403).send({ 
          success: false, 
          message: 'Failed to authenticate token..' 
      });
        
      } else {
        // if everything is good, save to request for use in other routes
        req.tokendata = decoded;    
        // console.log(decoded);
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}

 
});
