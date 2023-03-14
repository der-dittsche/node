const express = require("express");
const adminData = require("./admin");

const shopControllers = require("../controllers/shop");
const router = express.Router();

router.get("/", shopControllers.getIndex);
router.get("/products", shopControllers.getProducts);
router.get("/products/:productId", shopControllers.getProductDetail);
/* router.get("/card", shopControllers.getCard);
router.post("/card", shopControllers.postCard);
router.post("/card-delete-item", shopControllers.postDeleteItem);
router.get("/orders", shopControllers.getOrders);
router.post("/create-order", shopControllers.postOrder);
router.get("/checkout", shopControllers.getCheckout); */

module.exports = router;
