const Product = require("../models/product.js");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(prodId)
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
  Product.fetchAll()
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
    .then((products) => {
      res.render("shop/card", {
        path: "/card",
        pageTitle: "Your Card",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCard = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCard(product);
    })
    .then(() => {
      res.redirect("/card");
    });
};

exports.postDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCardItem(prodId)
    .then(() => {
      res.redirect("/card");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCard;
  req.user
    .getCard()
    .then((card) => {
      fetchedCard = card;
      return card.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProduct(
            products.map((product) => {
              product.orderItem = { quantity: product.cardItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCard.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((order) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: order,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
