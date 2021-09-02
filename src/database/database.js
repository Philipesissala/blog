const Sequelize = require("sequelize");
const connection = new Sequelize("blogBD", "root", "S1ssala23", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
