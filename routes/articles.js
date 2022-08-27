// routes directly related to articles
const express = require("express");
const Article = require("./../models/article");
const router = express.Router();

router.get("/new", (req, res) => {
    // pass blank default article
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
    // get article
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

// every time /articles/known...
// redirecting users to this router
router.get("/:slug", async (req, res) => {
    // 1. get article
    // req.params.id --> id of newly created model
    // findById --> async function

    // find() --> return array of articles
    const article = await Article.findOne({ slug: req.params.slug });

    // 2. check if can't find article
    if (article == null) {
        // redirect user back to homepage
        res.redirect("/");
    }

    // 3. render new page
    // pass article created --> query db
    res.render("articles/show", { article: article });
});

/*  -----------------------------------
// use this post method to save articles to database
// hook db to application --> in server.js
router.post("/", async (req, res) => {
    
         let article = new Article({
        // access form --> tell express how to access --> express.urlencoded
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    });

    try {
        // save successfully

        // async function
        article = await article.save();

        // string interporlation
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        console.log(e);

        // return error for any save failure
        // render page just on
        res.render("articles/new", { article: article });
        // pass article --> use previous form fields
        // render failed article
    } 
    
});
----------------------------------- */

// get Article and save to request
// call next function
router.post(
    "/",
    async (req, res, next) => {
        // blank article
        // creating a new article --> save to request
        req.article = new Article();

        // go onto next function in list --> saveArticle
        next();

        // returns saveArticle function
    },
    saveArticleAndRedirect("new")
);

/*
Create Delete Button 
- to call .delete version of router 
- need to have action of method DELETE 
method = "DELETE";

- link only does GET
- form only allows POST or GET 

DELETE for method to a form 
- use library method-override 
- override methods form passes 
- can do DELETE, PATCH & PUT 

require in server
*/

// delete route
// delete... async
router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);

    res.redirect("/");
});

// editing article
router.put(
    "/:id",
    async (req, res, next) => {
        req.article = await Article.findById(req.params.id);

        next();
    },
    saveArticleAndRedirect("edit")
);

// PUT & POST almost identical --> put into same function
// share b/w new & edit page
// type of middleware
// take in whatever the path is
function saveArticleAndRedirect(path) {
    // return a set of middlewares
    return async (req, res) => {
        // copy from POST

        // don't create article --> get from request
        // have article from request
        let article = req.article;
        article.title = req.body.title;
        article.markdown = req.body.markdown;
        article.description = req.body.description;

        // save article
        try {
            article = await article.save();

            // redirect if successful
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            // otherwise putting back on new page
            // pass in path --> either new or edit
            res.render(`articles/${path}`, { article: article });
        }
    };
}

module.exports = router;
