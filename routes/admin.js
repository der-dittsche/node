const express = require("express");

const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/add-product", isAuth, adminControllers.getAddProduct);

router.get("/products", isAuth, adminControllers.getProducts);

router.post("/add-product", isAuth, adminControllers.postProduct);

router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

router.post("/edit-product", isAuth, adminControllers.postEditProduct);

router.post("/delete-product", isAuth, adminControllers.postDeleteProduct);

exports.routes = router;
