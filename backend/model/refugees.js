
Refugees = sequelize.define('Refugees', {  
  company: { type: Sequelize.STRING,allowNull: false},
  type: { type: Sequelize.STRING,allowNull: false},
  amount : { type: Sequelize.INTEGER,allowNull: true},
});
Refugees.sync({force : false}).then(function () {
 	console.log("REFUGEES MODEL SYNCED");
});

