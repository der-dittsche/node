const express = require("express");
const adminData = require("./admin");

const productControllers = require("../controllers/products");
const router = express.Router();

router.get("/", productControllers.getProducts);

module.exports = router;
