
//  env : "amazon",
//  env : "local",
//  env : "production",
///*
var config = {
   env : "local",
    useCluster : false,     //use manually cluster mode. not needed when using pm2
    secret : "HEguLKWX8YAUd6JyesfrQxgYXeTh2RevUKtSRAmgPnmGdmufnPAaj55y8meEXmnHPWXGn2TeeLvB8ieJF6T6xuowNmsLvhWY3szAxZSTOuPClnUcJlaF8oKJIPuR7Zehq0xNliHLPusGV2YomuHxFZ567x2OC1bndXzEjEtzY8EkUFD06PiMSsBTN6JRAGdgCRM3zRKwtDibGIb9atxZABPW6J1UYXRxvTVWnMocxEoBkke2xmDPkKslRx",
    resetEnvForTests : false,    //setzt alle Tabellen neu auf und fügt seeddata ein
    timeNoSyncTillReceiveEmailAgain : 20,
    intercomAppID : "l9hkw9ed" ,
    intercomApiKey : "9dbcfa443152427eb130f0af7e30aa21a4775466" 
};




//console parameter to force start as local
if(process.argv[2] === "local"){
    config.env = "local";
}



if(config.env === "amazon" || config.env === "heroku"){
    
    config.ownhost = "http://default-environment-q3w7vutw76.elasticbeanstalk.com";
    config.webapphost = "http://h2342371.stratoserver.net";
    config.imageapihost = "http://default-environment-q3w7vutw76.elasticbeanstalk.com";
    config.website = "http://localhost:8000";
    config.isaacUrl = "https://mailtastic-playground.isaac10.com:8001";
   
    
}else if(config.env === "local"){
    
    config.ownhost = "http://localhost:3333";
    config.webapphost = "http://localhost:8000";
    config.imageapihost = "http://localhost:3333";
    config.website = "http://localhost:8000";
     config.isaacUrl = "https://mailtastic-playground.isaac10.com:8001";
    
    
}else if(config.env === "production"){
    
     config.ownhost = "https://www.app.mailtastic.de/api";
     config.webapphost = "https://www.app.mailtastic.de";
     config.website = "https://www.mailtastic.de";
     config.imageapihost = "http://www.app.mailtastic.de/api";
      config.isaacUrl = "https://mailtastic.isaac10.com:8001";
    
};


 config.imageDirUrl = config.ownhost + "/images/";
 

module.exports = config;