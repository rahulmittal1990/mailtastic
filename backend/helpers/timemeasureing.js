/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = function responseTime(){
  return function(req, res, next){
    var start = new Date;

    if (res._responseTime) return next();
    res._responseTime = true;

    res.on('header', function(){
      var duration = new Date - start;
      res.setHeader('X-Response-Time', duration + 'ms');
      console.error("REQUEST DURATION : " + duration);
    });
    
     res.on('finish', function(){
      var duration = new Date - start;
      //res.setHeader('X-Response-Time', duration + 'ms');
      console.error("REQUEST DURATION : " + duration + "ms");
    });
    
    

    next();
  };
};