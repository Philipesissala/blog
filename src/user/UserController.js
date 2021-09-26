const express = require("express");
const router = express.Router();

const User = require("./User");
const AdminAuth = require("../middleware/adminAuth");

const bcrypt = require("bcryptjs");

router.get("/admin/users",AdminAuth, (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create",AdminAuth, (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create",AdminAuth, (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user == undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        email,
        password: hash,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect("/");
        });
    } else {
      redirect("admin/users/create");
    }
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user !== undefined) {
      const correctPassword = bcrypt.compareSync(password, user.password);

      if (correctPassword) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
