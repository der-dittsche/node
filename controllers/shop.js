const Product = require("../models/product.js");
const Card = require("../models/card.js");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("shop/product-details", {
      product: product,
      pageTitle: "Details",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
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
