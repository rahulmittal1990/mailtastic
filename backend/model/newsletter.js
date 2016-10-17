Newsletter = sequelize.define('Newsletter', {  
	email : { type: Sequelize.STRING,allowNull: false},
        activated: { type: Sequelize.BOOLEAN, default: false},	
        activationCode : Sequelize.STRING
});
Newsletter.sync({force:false}).then(function () {
 	console.log("NEWSLETTER MODEL SYNCED");
});