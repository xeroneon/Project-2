module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("login");
    })

    app.get("/register", function(req, res) {
        res.render("register");
    })

    app.get("/dashboard", function(req, res) {
        res.render("dashboard");
    })
}