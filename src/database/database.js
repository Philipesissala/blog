const Sequelize = require("sequelize");
const connection = new Sequelize("blogBD", "root", "S1ssala23", {
  host: "localhost",
  dialect: "mysql",
  timezone: "+01:00",
});

module.exports = connection;
