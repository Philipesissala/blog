const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

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

app.get("/", (req, res) => {
  Article.findAll().then((articles) => {
    res.render("index", { articles });
  });
});

app.get("/:slug", (req, res) => {
  const { slug } = req.params;
  Article.findOne({ where: { slug } })
    .then((article) => {
      if (article !== undefined) {
        res.render("article", { article });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(3333, () => {
  console.log("Server running...");
});
