const db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        if(req.cookies.user_password === undefined) {
            res.render("login");
        } else if (req.cookies.user_password) {
            db.User.findOne({where: {user_name: req.cookies.user_name}}).then(user => {
                if(user.Authorize(req.cookies.user_password)) {
                    res.redirect("/dashboard");
                } else {
                    res.render("login");
                }
            })
        } 
        
        else {
            res.redirect("/dashboard")
        }

        // res.render("login");
    })

    app.get("/register", function(req, res) {
        res.render("register");
    })

    app.get("/dashboard", function(req, res) {
        console.log(req.cookies.user_password)
        res.render("dashboard");
    })
}