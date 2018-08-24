/* 
    We may want to consider further encapsulating our API routes by creating new directories in the
    routes folder, e.g., routes/api/users, routes/api/decks, routes/api/cards. I think that this
    may help to isolate issues and prevent us from working on the same files at the same time.
*/
const passport = require("passport");
const db = require("../models");
const mtg = require("mtgsdk");
const request = require('request');


module.exports = function (app) {
    app.post("/api/register-user", function (req, res) {
        let newUser = new db.User();
        req.body.user_password = newUser.genHash(req.body.user_password);
        db.User.create(req.body).then(function (results) {

            db.Deck
                .create({
                    user_id: results.user_id,
                    deck_name: "Collection"

                })
                .then(deck => {
                    res.json(deck);
                });
        });
    });

    // * Route hit when a user logs in

    app.post("/api/login", function (req, res) {

        db.User.findOne({
            where: {
                user_name: req.body.user_name
            }
        }).then(user => {
            if (user.Authorize(req.body.user_password)) {
                //log in the user
                const user_id = user.dataValues.user_id;
                console.log(user_id);
                console.log("user found");
                req.login(user_id, function (err) {
                    console.log("login hit");
                    res.json({
                        Auth: true
                    });


                });
            } else {
                res.json({
                    Auth: false
                });
            }
        });
    });
    passport.serializeUser(function (user_id, done) {
        done(null, user_id);
    });

    passport.deserializeUser(function (user_id, done) {
        done(null, user_id);
    });


    function authenticationMiddleware() {
        return (req, res, next) => {
            console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
            if (req.isAuthenticated()) return next();
            res.redirect('/login')
        };
    };
};