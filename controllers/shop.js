const Product = require("../models/product.js");
const Order = require("../models/order.js");
const PDFDocument = require("pdfkit");

const fs = require("fs");
const path = require("path");
const product = require("../models/product.js");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.getCard = (req, res, next) => {
  req.user
    .populate("card.items.productId")
    .then((user) => {
      const product = user.card.items;
      res.render("shop/card", {
        path: "/card",
        pageTitle: "Your Card",
        products: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("card.items.productId")
    .then((user) => {
      const product = user.card.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: product,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCard();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((order) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: order,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(500);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getInvoices = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);

      doc.fontSize(26).text("Invoice", { underline: true });
      doc.text("--------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        doc
          .fontSize(20)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              "*" +
              prod.product.price +
              "€"
          );
        doc
          .fontSize(20)
          .text(
            "article complete: " + prod.quantity * prod.product.price + "€"
          );
        doc.fontSize(24).text("--------------------------");
      });
      doc.text("total price: " + totalPrice + "€");
      doc.end();
      /*       fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + invoiceName + '"'
        );
        res.send(data);
      }); */
      /*       const file = fs.createReadStream(invoicePath);

      file.pipe(res); */
    })
    .catch((err) => next(err));
};
