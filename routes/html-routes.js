var request = require('request');
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    //main page
    app.get("/", (req, res) => {
        var icon;

        //get everything from database and sort with newly created @ top
        db.Article.find().sort({createdAt: -1}).exec((err, articles) => {

            articles.forEach((article) => {
                if (article.saved) {
                    star = "star";
                }
                else {
                    star = "star_border";
                }


                if(article.category === "Recipes") {
                    avatar = "restaurant"
                }
                else {
                    avatar= "restaurant_menu"
                }
                
                article.star = star;
                article.avatar = avatar;
            });

            var hbsObj = {
                article: articles
            };

            res.render("index", hbsObj);
        });
    });


    //saved articles page
    app.get("/saved", (req, res) => {

        //get all saved article from db
        db.Article.find({ saved: true }, (err, articles) => {

            articles.forEach((article) => {
                
                if(article.category === "Recipes") {
                    avatar = "restaurant"
                }
                else {
                    avatar= "restaurant_menu"
                }
                
                article.star = "star";
                article.avatar = avatar;
            });

            var hbsObj = {
                article: articles
            };
            res.render("index", hbsObj);
        });
    });

    //getting note
    app.get("/note/article/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then((article) => {
                res.json(article);
            })
            .catch((err) => {
                res.json(err);
                console.log(err);
            });
    });



    //scraping delish.com (cooking)
    app.get("/scrape", (req, res) => {
        request.get("https://www.delish.com/cooking/", (error, response, body) => {
            //load html into cheerio and save as $
            var $ = cheerio.load(body);
            $(".full-item").each((i, element) => {

                var title = $(element).find(".full-item-title").text().trim();

                var description = $(element).find(".full-item-dek p").text().trim();

                var link = "https://www.delish.com" + $(element).find(".full-item-title").attr("href").trim();

                var category = $(element).find(".item-parent-link").text().trim();

                //create result object with properties I want to grab
                var result = {
                    title: title,
                    description: description,
                    link: link,
                    category: category,
                }

                //Look for article with same title and update it, if it doesn't exist then add it
                db.Article.findOneAndUpdate(
                    {title: result.title},
                    result,
                    {upsert: true, new: true, runValidators: true},
                    (err, article) => {
                        // console.log(article);
                    }
                ).catch(err => {
                    return res.json(err);
                });
            });
        });
        res.json("Scraped articles!");
    });

}
