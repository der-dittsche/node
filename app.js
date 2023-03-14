const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const errorController = require("./controllers/error");

const sequelize = require("./util/mysql");
const Product = require("./models/product");
const User = require("./models/user");
const Card = require("./models/card");
const CardItem = require("./models/card-items");
const Order = require("./models/order");
const OrderItem = require("./models/order-items");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Card);
Card.belongsTo(User);
Card.belongsToMany(Product, { through: CardItem });
Product.belongsToMany(Card, { through: CardItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  /* .sync({ force: true }) */
  .sync()
  .then(() => {
    return User.findByPk(1);
    app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        surname: "Sascha",
        lastname: "Dietrich",
        email: "test@test.de",
        isAdmin: true,
      });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.createCard();
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
