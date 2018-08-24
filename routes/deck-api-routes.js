const db = require("../models");
const mtg = require("mtgsdk");

module.exports = function (app) {
    
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
        deck_name: (string)
    }*/
    app.post("/api/decks", (req, res) => {
        db.Deck
            .create({
                // user_id: req.cookies.user_id || req.body.user_id,
                user_id: req.user,
                deck_name: req.body.deck_name

            })
            .then(result => {
                res.json(result);
            })
            .catch( err => {
                console.log(err);
                res.json({
                    error: "true"
                });
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
            })
            .catch( err => {
                console.log(err);
                res.json({
                    error: true
                });
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
            })
            .catch( err => {
                console.log(err);
                res.json({
                    error: true
                });
            });
    });

    // * Get a given Deck by ID
    app.get("/api/decks/:id", (req, res) => {
        
        // TODO: try to get this working where an actual deck is used for the .getCards() method.
        /* db.Deck
        .findOne({
            where: {
                deck_id: req.params.id
            }
        })
        .then( thisDeck => {

            thisDeck
                .getCards()
        }) */
        const thisDeck = new db.Deck();

        thisDeck.deck_id = req.params.id;

        thisDeck
        .getCards()
        .then(result => {
            res.json(result);
        });
        
    });

};