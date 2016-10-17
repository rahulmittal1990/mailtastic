// var mongoose = require('mongoose');  
// var view = new mongoose.Schema({  
  // created: { type: Date, default: Date.now },
  // userId: mongoose.Schema.Types.ObjectId,
  // groupId: mongoose.Schema.Types.ObjectId,
// });
// mongoose.model('View', view);
// 
// View = mongoose.model('View');
// 
// 


View = sequelize.define('View', {  
	userId: { type: Sequelize.UUID,allowNull: false},
  	groupId: { type: Sequelize.INTEGER,allowNull: false},
  	campaignId: { type: Sequelize.INTEGER,allowNull: false},
});
var overallConfig = require('../config/config.js');
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

View.sync({force:resetData}).then(function () {
 	console.log("VIEW MODEL SYNCED");
});