const express = require("express");
const slugify = require("slugify");

const router = express.Router();

const Category = require("../categories/Category");
const Article = require("./Article");

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

router.post("/articles/delete", (req, res) => {
  const id = req.body.id;
  console.log(id);
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: { id },
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/articles");
  } else {
    Article.findByPk(id)
      .then((article) => {
        if (article != undefined) {
          Category.findAll().then((categories) => {
            res.render("admin/articles/edit", { article, categories });
          });
        } else {
          res.redirect("/");
        }
      })
      .catch((error) => {
        res.redirect("/");
      });
  }
});

module.exports = router;
