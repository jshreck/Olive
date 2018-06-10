
// var cheerio = require("cheerio");
var db = require("../models");


module.exports = function (app) {

    app.post("/api/article/:id", (req, res) => {
        console.log(req.body);

        db.Note.create(req.body)
            .then((note) => {
                return db.Article.findOneAndUpdate(
                    { _id: req.params.id },
                    { note: note._id },
                    { new: true });
            })
            .then((article) => {
                res.json(article);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    //updating the value for "saved"
    app.put(`/api/updateSave/:id`, (req, res) => {

        saved = (req.body.saved);

        if (saved === "true") {
            saved = false;
            console.log("is saved");
        }
        else {
            saved = true;
            console.log("is not saved");
        }


        //get article from db and change the saved value
        db.Article.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { saved: saved } },
            { new: true }
        ).then((article) => {
            res.json(article);
        }
        ).catch(err => {
            res.json(err);
        });
    });
}