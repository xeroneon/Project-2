/* 
    We may want to consider further encapsulating our API routes by creating new directories in the
    routes folder, e.g., routes/api/users, routes/api/decks, routes/api/cards. I think that this
    may help to isolate issues and prevent us from working on the same files at the same time.
*/

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
            // res.json(results);
        });
    });

    // * Route hit when a user logs in

    app.post("/api/login", function (req, res) {
        //use sequelize to find their account by name
        db.User.findOne({ where: { user_name: req.body.user_name } }).then(user => {
            //then using a method created on the user model authorizes and checks hashed password and if it returns true(correct password) send back that they are authorized
            if (user.Authorize(req.body.user_password)) {
                //sends back whether the user is authorized
                res.cookie("user_id", user.user_id, { maxAge: 1000 * 60 * 60 * 24 });
                res.cookie("user_name", req.body.user_name, { maxAge: 1000 * 60 * 60 * 24 });
                res.json({ Auth: true });
            } else {
                //TODO => create logic for if the password is wrong here
                console.log("not auth")
            };
        });
    });


    // * Get all decks for a given user
    app.get("/api/users/:id", (req, res) => {
        db.User.findOne({
            where: {
                user_id: req.params.id
            },
            include: [{
                model: db.Deck
            }]
        }).then(user => {
            res.json(user)
        });
    });

    // * Add a deck to a user. Requires the following req object:
    /*{
        user_id: (integer),
        deck_name: (string)
    }*/
    app.post("/api/decks", (req, res) => {
        db.Deck
            .create({
                // user_id: req.cookies.user_id || req.body.user_id,
                user_id: req.body.user_id,
                deck_name: req.body.deck_name

            })
            .then(result => {
                res.json(result);
            });
    });

    app.post("/api/add-card-col", function (req, res) {
        db.User.findOne(
            {
                where: {
                    user_id: req.body.user_id
                },
                include: [
                    {
                        model: db.Deck,
                        where: {
                            deck_name: "Collection"
                        }
                    }
                ]
            }
        ).then(user => {
            console.log(req.body.user_id)
            res.json(user);


        });
    });


    // * Add a card to a user's deck. Requires the following req object:
    /*{
        deck_id: (integer)
        card_id: (string)
        card_quantity: (integer)
    }*/
    app.post("/api/decks/add-card", (req, res) => {

        let thisDeck = new db.Deck();
        thisDeck.deck_id = req.body.deck_id;

        let newCard = new db.Card();
        newCard.card_id = req.body.card_id;
        newCard.card_quantity = req.body.card_quantity;

        thisDeck
            .addCard(
                newCard, {
                    through: {
                        card_quantity: req.body.card_quantity
                    }
                }
            )
            .then(result => {
                res.json(result);
            });
    });

    // * Update a card in a user's deck. Requires the following req object:
    /*{
        deck_id: (integer)
        card_id: (string)
        card_quantity: (new quant)
    }*/
    app.put("/api/decks/set-card", (req, res) => {

        // let thisDeckComp = new db.DeckComp();
        // thisDeckComp.card_quantity = req.body.card_quantity;

        db.DeckComp
            .update(
                {
                    card_quantity: req.body.card_quantity
                },
                {
                    where: {
                        deck_id: req.body.deck_id,
                        card_id: req.body.card_id
                    }
                }
            )
            .then(result => {
                res.json(result);
            });
    });

    // * Get a given Deck by ID
    app.get("/api/decks/:id", (req, res) => {
        /* db.Deck
        .findAll({
            where: {
                deck_id: req.params.id
            }
        },
        {
            include: [{
                model: db.Card
            }]
        }) */
        // const thisDeck = new db.Deck();

        // thisDeck.deck_id = req.params.id;

        // thisDeck
        //     .getCards()
        //     .then(result => {
        //         res.json(result);
        //     });

        db.Deck.findOne(
            {
                where: {
                    deck_id: req.params.id
                }
            }
        ).then(deck => {
            deck.getCards().then(cards => {
                res.json(deck);
            })
        })
    });

    // * Add cards to the database. Requires the following fields in the req object:
    /* {
        cardID: (string),
        cardName: (string),
        cardText: (string),
        cardSet: (string),
        cardRarity: (string),
        cardMana: (string),
        cardImage: (string),
        cardArtist: (string)
    } */
    app.post("/api/cards", (req, res) => {

        const thisCard = req.body;

        let options = {
            method: 'POST',
            headers: {
                Authorization: "bearer " + process.env.BEARER_TOKEN
            },
            url: 'http://api.tcgplayer.com/catalog/categories/1/search',
            body:
            {
                filters: [
                    {
                        "name": "productName",
                        "displayName": "Product Name",
                        "inputType": "Text",
                        "items": [thisCard.cardName],
                        "values": [thisCard.cardName]

                    },
                    {
                        "name": "SetName",
                        "displayName": "Set Name",
                        "inputType": "SingleValue",
                        "items": [],
                        "values": [thisCard.cardSet]
                    }
                ]
                // includeAggregates: 'true'
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            results = body.results

            var options = {
                method: 'GET',
                headers: {
                    Authorization: "bearer " + process.env.BEARER_TOKEN
                },
                url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/' + results[0],
                // qs: { getExtendedFields: 'true' }
            };
    
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
    
                body = JSON.parse(body);
    
                console.log(body.results)
                db.Card
                .findOrCreate({
                    where: {
                        card_id: req.body.cardID
                    },
                    defaults: {
                        card_id: thisCard.cardID,
                        card_name: thisCard.cardName,
                        card_text: thisCard.cardText,
                        card_set: thisCard.cardSet,
                        card_rarity: thisCard.cardRarity,
                        card_mana_cost: thisCard.cardMana,
                        card_image: thisCard.cardImage || body.results[0].image,
                        card_artist: thisCard.cardArtist,
                        card_tcg_id: results[0]
                    }
                })
                .spread((card, created) => {
                    return card;
                })
                .then(card => {
                    res.json(card);
                    console.log(card.get("card_name") + " created.");
                    
                });
            });

        });
    });

    // TODO Delete deck from a user's account
    /* {
        user_id: (integer),
        deck_id: (integer)
    } */
    /* app.delete("/api/decks", (req, res) => {

    }); */

    // TODO Delete card from a user's deck
    /* {
        deck_id: (integer),
        card_id: (string)
    } */
    /* app.delete("/api/decks", (req, res) => {

    }); */

    // Returns an array of all cards matching the searched-for card name.
    app.post("/api/search-card", (req, res) => {

        mtg.card.where({
            name: req.body.cardName
        })
            .then(resultCards => {
                responseCards = resultCards.map(card => {
                    return {
                        cardID: card.id,
                        cardName: card.name,
                        cardText: card.text,
                        cardSet: card.setName,
                        cardRarity: card.rarity,
                        cardMana: card.manaCost,
                        cardImage: card.imageUrl || "/images/placeholder.png",
                        cardArtist: card.artist
                    };
                });

            //     let options = {
            //         method: 'POST',
            //         headers: {
            //             Authorization: "bearer " + process.env.BEARER_TOKEN
            //         },
            //         url: 'http://api.tcgplayer.com/catalog/categories/1/search',
            //         body:
            //         {
            //             filters: [
            //                 {
            //                     "name": "productName",
            //                     "displayName": "Product Name",
            //                     "inputType": "Text",
            //                     "items": [responseCards],
            //                     "values": [responseCards]
        
            //                 },
            //                 {
            //                     "name": "SetName",
            //                     "displayName": "Set Name",
            //                     "inputType": "SingleValue",
            //                     "items": [],
            //                     "values": [thisCard.cardSet]
            //                 }
            //             ]
            //             // includeAggregates: 'true'
            //         },
            //         json: true
            //     };

            //     request(options, function (error, response, body) {
            //         if (error) throw new Error(error);
            //         results = body.results

            //         var options = {
            //             method: 'GET',
            //             headers: {
            //                 Authorization: "bearer " + process.env.BEARER_TOKEN
            //             },
            //             url: 'http://api.tcgplayer.com/v1.5.0/catalog/products/' + results[0],
            //             // qs: { getExtendedFields: 'true' }
            //         };
            
            //         request(options, function (error, response, body) {
            //             if (error) throw new Error(error);
            
            //             body = JSON.parse(body);
            
            //             console.log(body.results)
            //             if(responseCards.cardImage === undefined) {
            //                 responseCards.cardImage = body.results[0].image;
            //             }
                        res.json(responseCards);
            //         });


            //     });
                

            });
    });


    app.post("/api/add-card", function (req, res) {

        // let newCard = new db.Card();
        // newCard.card_id = req.body.card_id;
        let i = req.body.card_id - 1;


        db.Deck.findOne(
            {
                where: {
                    deck_id: req.body.deck_id
                },
                include: [{
                    model: db.Card
                    // where: {
                    //     card_id: req.body.card_id
                    // }
                }]
            }
        ).then(deck => {

            // if(deck.Cards[0] === undefined) {
            //     let newCard = new db.Card();
            //     newCard.card_id = req.body.card_id;

            //     deck.addCard(newCard, {through: {card_quantity: req.body.card_quantity}}).then(results => {
            //         return res.json(results)
            //     })
            // } else {
            //     console.log(deck.Cards[0]);

            let newCard = new db.Card();

            newCard.dataValues.card_id = req.body.card_id



            deck.addCard(newCard, {
                through:
                {
                    card_quantity: req.body.card_quantity
                }
            }).then(results => {
                res.json(deck);
            })
            // }
            res.json(deck)
        })
    })
};