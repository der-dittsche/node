const express = require("express");

const shopControllers = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/", shopControllers.getIndex);
router.get("/products", shopControllers.getProducts);
router.get("/products/:productId", shopControllers.getProductDetail);
router.get("/card", isAuth, shopControllers.getCard);
router.post("/card", isAuth, shopControllers.postCard);
router.post("/card-delete-item", isAuth, shopControllers.postDeleteItem);
router.get("/orders", isAuth, shopControllers.getOrders);
router.post("/create-order", isAuth, shopControllers.postOrder);
router.get("/orders/:orderId", isAuth, shopControllers.getInvoices);
router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
