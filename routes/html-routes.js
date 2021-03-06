const db = require("../models");
const request = require('request');
require('dotenv').config();
const mtg = require('mtgsdk')
const path = require("path");


module.exports = function (app) {

    app.get("/", function (req, res) {
        if (req.cookies.user_password === undefined) {
            res.sendFile(path.join(__dirname, "../public/html/login.html"));
        } else if (req.cookies.user_password) {
            db.User.findOne({ where: { user_name: req.cookies.user_name } }).then(user => {
                if (user.Authorize(req.cookies.user_password)) {
                    res.redirect("/dashboard");
                } else {
                    res.sendFile(path.join(__dirname, "../public/html/login.html"));
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

    app.get("/decks", function (req, res) {
        db.User.findOne(
            {
                where: {
                    user_id: req.user
                },
                include: [db.Deck]
            }
        ).then(user => {

            let data = {
                user: user.dataValues,
                decks: user.dataValues.Decks
            }
            console.log
            res.render("decks", data);
        })
    });

    app.get("/dashboard", function (req, res) {
       res.render('dashboard');
       console.log(req.isAuthenticated())
    });

    app.get("/collection", function(req, res) {

        console.log(req.user);

        db.User.findOne(
            {
                where: {
                    user_id: req.user
                },
                include: [
                    {
                        model: db.Deck,
                        where: {
                            deck_name: "collection"
                        },
                        include: [db.Card]
                    }
                ]
            }
        ).then(user => {

            // console.log(user.dataValues.Decks[0].dataValues.Cards[0].dataValues.DeckComp)

            let hbsObj = {
                user: user.dataValues,
                deck: user.dataValues.Decks[0].dataValues,
                cards: user.dataValues.Decks[0].dataValues.Cards
            }
            res.render("collection", hbsObj);
        })
    });


    app.get("/decks/:id", function(req, res) {
        
        db.User.findOne(
            {
                where: {
                    user_id: req.user
                },
                include: [
                    {
                        model: db.Deck,
                        where: {
                            deck_id: req.params.id
                        },
                        include: [db.Card]
                    }
                ]
            }
        ).then(user => {
            let hbsObj = {
                user: user.dataValues,
                deck: user.dataValues.Decks[0].dataValues,
                cards: user.dataValues.Decks[0].dataValues.Cards
            }

            // let productArr = [];

            // for (let i = 0; i < user.dataValues.Decks[0].dataValues.Cards.length; i++) {
            //     if(user.dataValues.Decks[0].dataValues.Cards[i].dataValues.card_tcg_id) {
            //         productArr.push(user.dataValues.Decks[0].dataValues.Cards[i].dataValues.card_tcg_id)
            //     }
            // }

            // console.log("Product Array: ", productArr)

            // var options = {
            //     method: 'GET',
            //     headers: {
            //         Authorization: "bearer " + process.env.BEARER_TOKEN
            //     },
            //     url: 'http://api.tcgplayer.com/v1.5.0/pricing/product/' + productArr,
            //     // qs: { getExtendedFields: 'true' }
            // };
    
            // request(options, function (error, response, body) {
            //     if (error) throw new Error(error);
    
            //     body = JSON.parse(body);
    
            //     console.log("body: ", body)
                // res.json(body)
                // console.log(user.dataValues.Decks[0].dataValues.Cards)
                res.render("deckview", hbsObj);
            // });


        })
    })
























    app.get("/test", function (req, res) {
        let options = {
            method: 'GET',
            headers: {
                Authorization: "bearer " + process.env.BEARER_TOKEN
            },
            url: 'http://api.tcgplayer.com/catalog/categories/1/search/manifest',
            body:
            {
                filters: [
                    {
                    "name": "productName",
                    "displayName": "Product Name",
                    "inputType": "Text",
                    "items": ["Black Lotus"],
                    "values": ["Black lotus"]

                },
                {
                    "name": "SetName",
                    "displayName": "Set Name",
                    "inputType": "SingleValue",
                    "items": [],
                    "values": ["alpha"]
                }
            ],
            // includeAggregates: 'true'
        },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            // console.log(body);

            let results = body.results;
            res.json(results)

            console.log(results);
            // let options = {
            //     method: 'GET',
            //     headers: {
            //         Authorization: "bearer " + process.env.BEARER_TOKEN
            //     },
            //     url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/' + results,
            //     // qs: { getExtendedFields: 'true' }
            // };

            
            // request(options, function (error, response, body) {
            //     if (error) throw new Error(error);
                
            //     body = JSON.parse(body);
            //     let productDetails = body

            //     // res.json(productDetails);




            //     var options = {
            //         method: 'GET',
            //         headers: {
            //             Authorization: "bearer " + process.env.BEARER_TOKEN
            //         },
            //         url: 'http://api.tcgplayer.com/v1.5.0/pricing/product/' + results,
            //         // qs: { getExtendedFields: 'true' }
            //     };
        
            //     request(options, function (error, response, body) {
            //         if (error) throw new Error(error);
        
            //         body = JSON.parse(body);
        
            //         console.log(body.results)
            //         res.json(body)
            //     });





            // });
            

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
            url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/1042',
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