const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const Users = require("./user/User");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "njk");
app.use(express.static("public"));
nunjucks.configure("src/views", {
  express: app,
  noCache: true,
  autoescape: false,
});

app.use(categoriesController);
app.use(articlesController);
app.use(usersController);

app.get("/", (req, res) => {
  Article.findAll({
    limit: 4,
    order: [["id", "DESC"]],
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles, categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  const { slug } = req.params;
  Article.findOne({ where: { slug } })
    .then((article) => {
      if (article !== undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const { slug } = req.params;
  Category.findOne({ where: { slug }, include: [{ model: Article }] })
    .then((category) => {
      if (category !== undefined) {
        Category.findAll().then((categories) => {
          res.render("index", { articles: category.articles, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.listen(3333, () => {
  console.log("Server running...");
});
