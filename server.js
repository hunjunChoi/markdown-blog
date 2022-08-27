const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const articleRouter = require("./routes/articles");
const Article = require("./models/article");
const app = express();

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
});

app.set("view engine", "ejs");

// access all parameters from article form --> in article route --> request.body
// need to come first before /articles
app.use(express.urlencoded({ extended: false }));

// pass the string use
// _method: whenever set parameter _method in any type of form --> override method
// ex) pass _method DELETE --> calls .delete router
app.use(methodOverride("_method"));

// index route
app.get("/", async (req, res) => {
    // access articles --> pull in Articles model
    // find() --> get all articles
    // sort by newer ones on top
    const articles = await Article.find().sort({ createdAt: "desc" });
    /* const articles =  [
        {
            title: "Test title",
            createdAt: new Date(),
            description: "Test description",
        },

        {
            title: "Test title 2",
            createdAt: new Date(),
            description: "Test description 2",
        },
    ]; */

    // passing article down to articles/new
    // use inside of articles/new & form_fields
    // set default value
    res.render("articles/index", { articles: articles });
});

// every articleRouters --> begin with /articles
app.use("/articles", articleRouter); // bottom... comes after everything else

app.listen(3000);
