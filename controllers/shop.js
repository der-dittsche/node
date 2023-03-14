const Product = require("../models/product.js");
const Card = require("../models/card.js");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  /*   Product.findAll({where: {id: prodId}})
  .then((products) => {
    res.render("shop/product-details", {
      product: products[0],
      pageTitle: "Details" / products[0].title,
      path: "/products",
    });
  }) 
  .catch((err) => console.log(err));*/
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCard = (req, res, next) => {
  req.user
    .getCard()
    .then((card) => {
      return card
        .getProducts()
        .then((product) => {
          res.render("shop/card", {
            path: "/card",
            pageTitle: "Your Card",
            products: product,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCard = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCard;
  let newQuantity = 1;
  req.user
    .getCard()
    .then((card) => {
      fetchedCard = card;
      return card.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cardItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCard.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/card");
    });
};

exports.postDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCard()
    .then((card) => {
      return card.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cardItem.destroy();
    })
    .then(() => {
      res.redirect("/card");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
