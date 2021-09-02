const express = require("express");
const router = express.Router();

const slug = require("../lib/slug-format");
const Category = require("./Category");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  const title = req.body.title;
  console.log(title);
  if (title != undefined) {
    Category.create({
      title,
      slug: slug(title),
    }).then(() => {
      res.redirect("/");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories", (req, res) => {
  Category.findAll()
    .then((datas) => {
      res.render("admin/categories/index", { categories: datas });
    })
    .catch((error) => {
      res.send(`Erro ao tentar listar as categorias ${error}`);
    });
});

router.post("/admin/categories/delete", (req, res) => {
  const id = req.body.id;
  console.log(id)
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: { id },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

module.exports = router;
