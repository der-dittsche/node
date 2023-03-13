const Product = require("../models/product.js");
const Card = require("../models/card.js");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-details", {
        product: product[0],
        pageTitle: "Details",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCard = (req, res, next) => {
  Card.getCard((card) => {
    Product.fetchAll((products) => {
      const cardProducts = [];
      for (product of products) {
        const cardProductData = card.products.find(
          (prod) => prod.id === product.id
        );
        if (cardProductData) {
          cardProducts.push({ productData: product, qty: cardProductData.qty });
        }
      }
      res.render("shop/card", {
        path: "/card",
        pageTitle: "Your Card",
        products: cardProducts,
      });
    });
  });
};

exports.postCard = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Card.addProduct(prodId, product.price);
  });
  res.redirect("/card");
};

exports.postDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Card.deleteProduct(prodId, product.price);
    res.redirect("/card");
  });
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
