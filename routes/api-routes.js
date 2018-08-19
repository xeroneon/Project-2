const db = require("../models");

const mtg = require('mtgsdk');

module.exports = function (app) {
    app.post("/api/users", function (req, res) {
        let newUser = new db.User();
        req.body.user_password = newUser.genHash(req.body.user_password);
        db.User.create(req.body).then(function (results) {
            res.json(results);
        }).then(function () {
            db.User.findOne({
                where: {
                    user_name: req.body.user_name
                }
            }).then(user => {
                // console.log(user)
                db.Deck.create({
                    deck_name: "Collection",
                    UserUserId: user.dataValues.user_id
                }).then(deck => {
                    db.Deck.findOne({
                        where: {
                            deck_id: deck.dataValues.deck_id
                        }
                    }).then(deck => {
                        db.DeckComp.create({
                            DeckDeckId: deck.dataValues.deck_id
                        })
                    })
                })
            })
        });
        console.log(req.body)
    })
    //route hit when a user logs in
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

    app.post("/api/search-card", function (req, res) {
        let cardName = req.body.cardName;

        mtg.card.where({ name: cardName, pageSize: 1 })
            .then(card => {
                res.json(card);
            })


    })

    app.post("/api/add-card", function (req, res) {
        let cardName = req.body.cardName;

        mtg.card.where({ name: cardName, pageSize: 1 })
            .then(card => {
                // res.json(card);

                let newCard = {
                    card_name: card[0].name,
                    card_description: card[0].text,
                    card_edition: card[0].set,
                    card_image: card[0].imageUrl,
                    card_artist: card[0].artist,
                    card_mana_cost: card[0].manaCost,
                }

                // db.Card.create(newCard).then(function (results) {
                //     console.log("card Created")
                //     // res.json(results)
                // }).then(card => {
                    db.User.findOne({
                        where: {
                            user_name: req.cookies.user_name
                        }
                    }).then(user => {
                        db.Deck.findOne(
                            {
                                where: {
                                    UserUserId: user.dataValues.user_id 
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
                                // console.log("worked");
                                newCard.DeckCompDeckCompId = deckComp.dataValues.deck_comp_id

                                db.Card.create(newCard).then(card => {
                                    console.log("created")
                                })
                            })
                        })
                    })
                // })
            })


    })
};