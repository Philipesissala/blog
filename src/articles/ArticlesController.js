const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("../lib/slug-format");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

router.post("/articles/save", (req, res) => {
  const { title, body, categoryId } = req.body;
  Article.create({
    title,
    slug: slugify(title),
    body,
    categoryId,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

module.exports = router;
