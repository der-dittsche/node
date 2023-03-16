const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    /*     req.get("Cookie").split(";")[2].trim().split("=")[1] === "true"; */
    /* console.log(req.session.isLoggedIn); */
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: false,
    });
};

exports.postLogin = (req, res, next) => {
  User.findById("6412528e46c57993eb1174a4")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
