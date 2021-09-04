const express = require("express");
const router = express.Router();

const slugify = require("../lib/slug-format");
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
      slug: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories");
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
  console.log(id);
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

router.get("/admin/categories/edit/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories");
  } else {
    Category.findByPk(id)
      .then((category) => {
        if (category != undefined) {
          res.render("admin/categories/edit", { category });
        } else {
          res.redirect("/admin/categories");
        }
      })
      .catch((error) => {
        res.redirect("/admin/categories");
      });
  }
});

router.post("/categories/update/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  Category.update({ title, slug: slugify(title) }, { where: { id } }).then(
    () => {
      res.redirect("/admin/categories");
    }
  );
});

module.exports = router;
