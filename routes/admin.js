const express = require("express");

const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

const { body } = require("express-validator");

router.get("/add-product", isAuth, adminControllers.getAddProduct);

router.get("/products", isAuth, adminControllers.getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 3 }),
  ],
  isAuth,
  adminControllers.postProduct
);

router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 3 }),
  ],
  isAuth,
  adminControllers.postEditProduct
);

router.post("/delete-product", isAuth, adminControllers.postDeleteProduct);

exports.routes = router;
