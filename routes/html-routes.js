module.exports = function (app) {
    //login page
    app.get("/", (req, res) => {
        res.render("index");
    });
}