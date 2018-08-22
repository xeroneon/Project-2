/* 
    We may want to consider further encapsulating our API routes by creating new directories in the
    routes folder, e.g., routes/api/users, routes/api/decks, routes/api/cards. I think that this
    may help to isolate issues and prevent us from working on the same files at the same time.
*/

const db = require("../models");
const mtg = require("mtgsdk");


module.exports = function (app) {
    app.post("/api/users", function (req, res) {
        let newUser = new db.User();
        req.body.user_password = newUser.genHash(req.body.user_password);
        db.User.create(req.body).then(function (results) {
            res.json(results);
        });
    });

    // * Route hit when a user logs in

    app.post("/api/login", function (req, res) {
        //use sequelize to find their account by name
        db.User.findOne({ where: { user_name: req.body.user_name } }).then(user => {
            //then using a method created on the user model authorizes and checks hashed password and if it returns true(correct password) send back that they are authorized
            if (user.Authorize(req.body.user_password)) {
                //sends back whether the user is authorized
                res.cookie("user_password", req.body.user_password, { maxAge: 1000 * 60 * 60 * 24 });
                res.cookie("user_name", req.body.user_name, { maxAge: 1000 * 60 * 60 * 24 });
                res.json({ Auth: true });
            } else {
                //TODO => create logic for if the password is wrong here
                console.log("not auth")
            }
        })
    })


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

    // * Test with  Add a deck to a user. Requires the following req object:
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

    // TODO Add a card to a user's deck. Requires the following req object:
    /*{
        deck_id: (integer)
        card_id: (string)
        card_quantity: (integer)
    }*/
    app.post("/api/decks/add-card", (req, res) => {
        db.Deck
            .addCard(db.Card, {
                through: {
                    card_quantity: req.body.card_quantity
                }
            })
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
        const thisDeck = new db.Deck();

        thisDeck.deck_id = req.params.id;

        thisDeck
            .getCards()
            .then(result => {
                res.json(result);
            });
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
        .findOrCreate( {
            where: {
                card_id: req.body.cardID
            },
            defaults: {
                card_id : thisCard.cardID,
                card_name: thisCard.cardName,
                card_description: thisCard.cardFlavor,
                card_set: thisCard.cardSet,
                card_rarity: thisCard.cardRarity,
                card_mana_cost: thisCard.cardMana,
                card_image: thisCard.cardImage,
                card_artist: thisCard.cardArtist
            }
        })
        .spread( (card, created) => {
            return card;
        })
        .then ( card => {
            res.json( card );
            console.log( card.get("card_name") + " created." );
        });
    });

    // TODO Update card amount from a user's deck
    /* {
        
    } */

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

    // * Search for an MTG card by name
    /* POST object format:
        {
            cardName: (card name as string)
        }
    */
    // Returns an array of all cards matching the searched-for card name.
    app.post("/api/search-card", (req, res) => {

        mtg.card.where({
            name: req.body.cardName
        })
        .then( resultCards => {
            responseCards = resultCards.map( card => {
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
            
            res.json( responseCards );
        });
    });
};