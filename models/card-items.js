const Sequelize = require("sequelize");

const sequelize = require("../util/mysql");

const CardItem = sequelize.define("cardItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = CardItem;
