const express = require("express");

const productControllers = require("../controllers/products");
const router = express.Router();

router.get("/add-product", productControllers.getAddProduct);

router.post("/add-product", productControllers.postProduct);

exports.routes = router;
