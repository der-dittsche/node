const Sequelize = require("sequelize");

const sequelize = require("../util/mysql");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  /* adress_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  adress_street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  adress_contry: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  adress_zip: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  adress_city: {
    type: Sequelize.STRING,
    allowNull: false,
  }, */
});

module.exports = Order;
