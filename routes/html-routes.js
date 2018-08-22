const db = require("../models");
const request = require('request');
require('dotenv').config();
const mtg = require('mtgsdk')



module.exports = function (app) {

    app.get("/", function (req, res) {
        if (req.cookies.user_password === undefined) {
            res.render("login");
        } else if (req.cookies.user_password) {
            db.User.findOne({ where: { user_name: req.cookies.user_name } }).then(user => {
                if (user.Authorize(req.cookies.user_password)) {
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

    app.get("/register", function (req, res) {
        res.render("register");
    })

    app.get("/deckview", function (req, res) {
        res.render("deckview");
    });

    app.get("/dashboard", function (req, res) {
        console.log(req.cookies.user_password)
        // let hbsObj = {};
        db.User.findOne(
            {
                where: {
                    user_name: req.cookies.user_name
                }
            }
        ).then(user => {
            let hbsObj = {
                user: user
            }
            db.Deck.findOne(
                {
                    where: {
                        UserUserId: user.dataValues.user_id,
                        deck_name: "Collection"
                    }
                }
            ).then(deck => {
                db.DeckComp.findOne(
                    {
                        where: {
                            DeckDeckId: deck.dataValues.deck_id
                        }
                    }
                ).then(deckComp => {
                    db.Card.findAll(
                        {
                            where: {
                                DeckCompDeckCompId: deckComp.dataValues.deck_comp_id 
                            }
                        }
                    ).then(card => {
                        // console.log(card)
                        // let hbsObj = {
                        //     card: card
                        // }

                        hbsObj.card = card
                        // hbsObj.card = card;
                        // console.log(hbsObj);
                        res.render("dashboard", hbsObj);
                    })
                })
            })
        })



    })

    app.get("/test", function (req, res) {
        mtg.card.where({ name: 'Squee', pageSize: 1 })
            .then(card => {
                console.log(card);
            })


        var options = {
            method: 'GET',
            url: "http://magictcgprices.appspot.com/api/cfb/price.json?cardname=Dark%20Confidant&setname=ravnica",
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);

            res.json(body)
        });


        var options = {
            method: 'POST',
            headers: {
                Authorization: "bearer " + process.env.BEARER_TOKEN
            },
            url: 'http://api.tcgplayer.com/catalog/categories/1/search',
            body:
            {
                filters: [{ name: 'productName', values: 'Black Lotus' }],
                includeAggregates: 'true'
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);

            res.json(body)
        });

        // res.render("login")
    })

    app.get("/test2", function (req, res) {
        // var body = "grant_type=client_credentials&client_id=" + process.env.PUBLIC_KEY + "&client_secret=" + process.env.PRIVATE_KEY
        // // "grant_type=client_credentials&client_id=141D8D58-822E-4E59-9063-7A1A12387314&client_secret=42A58374-6852-4405-B029-C341131F317D"

        // let bearerToken;

        // var options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     url: 'https://api.tcgplayer.com/token',
        //     body: body,
        //     json: true
        // };

        // request(options, function (error, response, body) {
        //     if (error) throw new Error(error);

        //     console.log(body.access_token);
        // });

        //--------------------------------------------------------

        var options = {
            method: 'GET',
            headers: {
                Authorization: "bearer " + process.env.BEARER_TOKEN
            },
            url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/137942',
            // qs: { getExtendedFields: 'true' }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            body = JSON.parse(body);

            console.log(body.results)
            res.json(body)
        });
    })
}