GlobalConfig = {};


var env = "local";



switch(env){
    case "local" : 
            GlobalConfig.config = {
            apiUrl: "http://localhost:3333",
        };
        break;
    case "amazon" : 
        GlobalConfig.config = {
            apiUrl: "http://default-environment-q3w7vutw76.elasticbeanstalk.com",
        };
        break;
    case "production" : 
        GlobalConfig.config = {
            apiUrl: "https://www.app.mailtastic.de/api"
        };
        break;
}

GlobalConfig.config.env = env;