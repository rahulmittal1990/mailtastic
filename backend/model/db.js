// var mongoose = require('mongoose');


var overallConfig = require('../config/config.js');
if(overallConfig.env === "amazon"){
    var config = {
        port : process.env.RDS_PORT,
        username : process.env.RDS_USERNAME,
        password :  process.env.RDS_PASSWORD,
        host : process.env.RDS_HOSTNAME,
        dbname : process.env.RDS_DB_NAME
    };
}else if(overallConfig.env === "local"){
    
    if(overallConfig.resetEnvForTests === true){
        //var config = require('./config/mysqllocaltest.json');
          var config = require('./config/mysqllocal.json');
    }else{
        var config = require('./config/mysqllocal.json');
    }
    
    
    
}else if(overallConfig.env === "production"){
    var config = require('./config/mysqlproduction.json');
}else if(overallConfig.env === "heroku"){
     var config = require('./config/postgresqlHeroku.json');
}





/**
 * Init models
 */



// module.exports = mongoose.connect('mongodb://localhost/' + config.dbname);
var sequelLogging = false;
var useNative = false;
var dialect = "mysql";
if((overallConfig.env === "amazon" || overallConfig.env === "local" || overallConfig.env === "heroku")){  //nur wenn es sich um amazon oder local handelt
    sequelLogging = true;
  
}
if( overallConfig.env === "heroku"){  //nur wenn es sich um amazon oder local handelt
   
    useNative = true;
    dialect = "postgres";
}



try{
    

sequelize = new Sequelize(
  config.dbname, config.username, config.password, {
  host: config.host,
  dialect: dialect,
  logging: sequelLogging,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
   define: {
    timestamps: true, // true by default
    freezeTableName: true // Model tableName will be the same as the model name
  },
  native: useNative,
});
}
catch(e){
    console.error("CANT CONNECT TO DATABASE");
    console.error(
            JSON.stringify({
                    dbName :   config.dbname, 
                    userName : config.username, 
                    pass : config.password,
                    additional : {
                        host: config.host,
                        dialect: dialect,
                        logging: sequelLogging,
                        pool: {
                          max: 10,
                          min: 0,
                          idle: 10000
                        },
                        define: {
                         timestamps: true, // true by default
                         freezeTableName: true // Model tableName will be the same as the model name
                        },
                        native: useNative
                    }
                })
    );       
};


require('./view.js');
require('./click.js');
require('./campaigns.js');
require('./users.js');
//require('./companyinfo.js');
require('./groups.js');
require('./preregister.js');
require('./newsletter.js');
require('./refugees.js');
require('./signature.js');
require('./companyinfo.js');




//Campaign.hasMany(Group, {foreignKey: 'activeCampaign'});
//Group.belongsTo(Campaign, {foreignKey: 'activeCampaign'});

//User.belongsTo(Group, {foreignKey: 'currentGroup'});
//Group.belongsTo(User, {foreignKey: 'currentGroup'});

//insert seeddata
//if(overallConfig.resetEnvForTests === true && (overallConfig.env === "amazon" || overallConfig.env === "local")){  //nur wenn es sich um amazon oder local handelt
//    require('./seeddata.js');
//}


module.exports = sequelize;
