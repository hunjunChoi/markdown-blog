const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");

// returns a function
const createDOMPurify = require("dompurify");

// { JSDOM }: only want jsdom portion of what this returns
const { JSDOM } = require("jsdom");

// create dompurifier
// get the window object of JSDOM
const window = new JSDOM("").window;

// allows dom purifier to create html & purify
// using jsdom.window object
// look at documentation
const DOMPurify = createDOMPurify(window);

// create Scehma
const articleSchema = new mongoose.Schema({
    // pass in set of options for all of different columns in articles
    title: {
        // specify options
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,

        // default --> takes function
        default: () => Date.now(),
        // or: default: Date.now
    },

    // calculate once --> save to db
    slug: {
        type: String,
        required: true,

        // can't have more than one of same slug
        unique: true,
    },
    sanitizedHTML: {
        type: String,
        required: true,
    },
});

// automatically calculate slug everytime save article
// set up validation & ... attribute
// run function right before validation on article everytime CRUD
// create slug from title
articleSchema.pre("validate", function (next) {
    if (this.title) {
        // strict: true --> force slugify to remove characters that don't fit in url
        // ex) remove : from this.title
        this.slug = slugify(this.title, { lower: true, strict: true });

        // 1. change /:id to /:slug
        // 2. find based on req.params.slug
        // 3. redirect to /articles/${article.slug}
    }

    // convert markdown to sanitized html
    if (this.markdown) {
        // converting markdown to html & sanitize
        this.sanitizedHTML = DOMPurify.sanitize(marked.parse(this.markdown));
    }

    // don't call --> get validation error
    next();
});

// use Schema --> export
module.exports = mongoose.model("Article", articleSchema);
// import in articles.js

/* Steps after Read More button  
- make markdown render properly
- don't use id for url --> use slug == version of title 

1. modify models 
2. import libraries: marked & slugify 
    - marked: create markdown --> turn into html 
    - slugify: convert to url friendly slug 
*/

/* 
Marked down portion
- convert markdown to HTML ---> sanitize html 
- can't add malicious code on markdown & run JS code 
- sanitize otherwise can run html properly 

libraries 
dompurify: allows to sanitize html 
jsdom: render html inside of nodejs... doesn't know how to run html on its own
*/
