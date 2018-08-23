/* 
    We may want to consider further encapsulating our API routes by creating new directories in the
    routes folder, e.g., routes/api/users, routes/api/decks, routes/api/cards. I think that this
    may help to isolate issues and prevent us from working on the same files at the same time.
*/

const db = require("../models");
const mtg = require("mtgsdk");


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

<<<<<<< HEAD
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


        })
    })

    // TODO Add a card to a user's deck. Requires the following req object:
=======
    // * Add a card to a user's deck. Requires the following req object:
>>>>>>> 2df880980218b0985ecd01c6ebc504a09e04e8d6
    /*{
        deck_id: (integer)
        card_id: (string)
        card_quantity: (integer)
    }*/
    app.post("/api/decks/add-card", (req, res) => {
<<<<<<< HEAD
        // db.Deck
        //     .addCard(db.Card, {
        //         through: {
        //             card_quantity: req.body.card_quantity
        //         }
        //     })
        //     .then(result => {
        //         res.json(result);
        //     });

        db.Deck.findOne(
            {
                where: {
                    deck_id: req.body.deck_id
                }
            }
        ).then(deck => {
            deck.addCard(db.Card, {
                through: {
=======
        
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
>>>>>>> 2df880980218b0985ecd01c6ebc504a09e04e8d6
                    card_quantity: req.body.card_quantity
                },
                {
                    where: {
                        deck_id: req.body.deck_id,
                        card_id: req.body.card_id
                    }
                }
<<<<<<< HEAD
            }).then(results => {
                res.json(results);
            })
        })
=======
            )
            .then(result => {
                res.json(result);
            });
>>>>>>> 2df880980218b0985ecd01c6ebc504a09e04e8d6
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
        cardFlavor: (string),
        cardSet: (string),
        cardRarity: (string),
        cardMana: (string),
        cardImage: (string),
        cardArtist: (string)
    } */
    app.post("/api/cards", (req, res) => {

        const thisCard = req.body;

        db.Card
            .findOrCreate({
                where: {
                    card_id: req.body.cardID
                },
                defaults: {
                    card_id: thisCard.cardID,
                    card_name: thisCard.cardName,
                    card_description: thisCard.cardFlavor,
                    card_set: thisCard.cardSet,
                    card_rarity: thisCard.cardRarity,
                    card_mana_cost: thisCard.cardMana,
                    card_image: thisCard.cardImage,
                    card_artist: thisCard.cardArtist
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
                        cardFlavor: card.flavor,
                        cardSet: card.setName,
                        cardRarity: card.rarity,
                        cardMana: card.manaCost,
                        cardImage: card.imageUrl,
                        cardArtist: card.artist
                    };
                });

                res.json(responseCards);
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