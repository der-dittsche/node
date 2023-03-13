const express = require("express");

const adminControllers = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", adminControllers.getAddProduct);
router.get("/products", adminControllers.getProducts);

router.post("/add-product", adminControllers.postProduct);

exports.routes = router;
