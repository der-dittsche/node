const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("No valid email adress")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with 8 or more characters include a number"
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("No valid email adress")
      .custom((value, { req }) => {
        /*         if (value === "test@test.de") {
          throw new Error("This email adress is forbidden");
        }
        return true; */
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail exists already.");
          }
        });
      }),
    body("password")
      .isLength({ min: 8 })
      .withMessage(
        "Please enter a password with 8 or more characters and have a number"
      )
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(
            "The Password confirm is not equl to your given password or not match characters and numbers"
          );
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
