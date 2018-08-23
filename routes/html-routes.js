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
        let user_id = req.body.user_id

        db.User.findOne(
            {
                where: {
                    user_id: user_id
                },
                include: [
                    {
                        model: db.Deck,
                        include: [
                            {
                                model: db.Card,
                            }
                        ]
                    }
                ]
            }
        ).then(user => {
            res.render("dashboard", user);
        });
    })

    app.get("/test", function (req, res) {
        // mtg.card.where({ name: 'Squee', pageSize: 1 })
        //     .then(card => {
        //         console.log(card);
        //     })


        // var options = {
        //     method: 'GET',
        //     url: "http://magictcgprices.appspot.com/api/cfb/price.json?cardname=Dark%20Confidant&setname=ravnica",
        //     json: true
        // };

        // request(options, function (error, response, body) {
        //     if (error) throw new Error(error);

        //     console.log(body);

        //     res.json(body)
        // });


        let options = {
            method: 'POST',
            headers: {
                Authorization: "bearer " + process.env.BEARER_TOKEN
            },
            url: 'http://api.tcgplayer.com/catalog/categories/1/search',
            body:
            {
                filters: [{
                    "name": "productName",
                    "displayName": "Product Name",
                    "inputType": "Text",
                    "items": ["Black Lotus"],
                    "values": ["Black lotus"]

                }]
                // includeAggregates: 'true'
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            // console.log(body);

            let results = body.results;

            console.log(results);
            let options = {
                method: 'GET',
                headers: {
                    Authorization: "bearer " + process.env.BEARER_TOKEN
                },
                url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/' + results,
                // qs: { getExtendedFields: 'true' }
            };

            
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                
                body = JSON.parse(body);
                let productDetails = body

                // res.json(productDetails);




                var options = {
                    method: 'GET',
                    headers: {
                        Authorization: "bearer " + process.env.BEARER_TOKEN
                    },
                    url: 'http://api.tcgplayer.com/v1.5.0/pricing/product/' + results,
                    // qs: { getExtendedFields: 'true' }
                };
        
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
        
                    body = JSON.parse(body);
        
                    console.log(body.results)
                    res.json(body)
                });





            });
            

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
            url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/8989',
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