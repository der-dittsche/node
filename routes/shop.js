const express = require("express");
const adminData = require("./admin");

const shopControllers = require("../controllers/shop");
const router = express.Router();

router.get("/", shopControllers.getIndex);
router.get("/products", shopControllers.getProducts);
router.get("/card", shopControllers.getCard);
router.get("/orders", shopControllers.getOrders);
router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
