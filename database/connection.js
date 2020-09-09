const Sequelize = require("sequelize");

const connection = new Sequelize("guiapres","wellyson98","flare12345",{
    host:"mysql669.umbler.com",
    dialect:"mysql",
    timezone:"-03:00"
});

module.exports = connection;