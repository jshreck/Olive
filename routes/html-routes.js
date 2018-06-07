var request = require('request');
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function (app) {
    //login page
    app.get("/", (req, res) => {
        res.render("index");
    });


    app.get("/scrape", (req, res) => {
        request.get("https://www.delish.com/cooking/", (error, response, body) => {
            //load html into cheerio and save as $
            var $ = cheerio.load(body);
            $(".full-item").each((i, element) => {

                //can replace element with this

                var title = $(element).find(".full-item-title").text().trim();

                var description = $(element).find(".full-item-dek p").text().trim();

                var link = "https://www.delish.com" + $(element).find(".full-item-title").attr("href");

                var category = $(element).find(".item-parent-link").text().trim();



                // console.log(`${category}
                // ${link}
                // ${title}
                // ${description}`);
                //If want to distinguish based on category
                // switch (category) {
                //     case "Recipes":
                //       console.log("This is a recipe");
                //     case "Meals & Cooking":
                //         console.log("Meals and Cooking");
                // }

                //create result object with properties I want to grab
                var result = {
                    title: title,
                    description: description,
                    link: link,
                    category: category,
                }

                //WANT TO CHECK AND MAKE SURE ITS NEW ARTICLE BEFORE SAVING
                //create new Article
                db.Article.create(result).then(article => {
                    console.log(article);
                }).catch(err => {
                    return res.json(err);
                })
            });
        });
        //for now just rendering main page
        res.render("index");
    });

}
