CompanyInfo = sequelize.define('CompanyInfo', {
    syncInfoId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin: Sequelize.UUID,
    syncAdminEmail: Sequelize.STRING,
    isAutomaticSync:Sequelize.BOOLEAN,
    isGoogleStructure: Sequelize.BOOLEAN,
    isDisconnected: Sequelize.BOOLEAN,
    accessTokenKey: Sequelize.STRING

});

var overallConfig = require('../config/config.js');
var resetData = false;
if ((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true) {
    resetData = true;
}

CompanyInfo.sync({ force: resetData }).then(function () {
    console.log("COMPANYINFO MODEL SYNCED");
});
