Preregister = sequelize.define('Preregister', {  
	name: { type: Sequelize.STRING,allowNull: false},
  	email : { type: Sequelize.STRING,allowNull: true},
  	wantsBeta : { type: Sequelize.BOOLEAN,default: false},
  	wantsInfo : { type: Sequelize.BOOLEAN, default: false}	
});
Preregister.sync({force:false}).then(function () {
 	console.log("Preregister MODEL SYNCED");
});