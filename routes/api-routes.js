/* 
    We may want to consider further encapsulating our API routes by creating new directories in the
    routes folder, e.g., routes/api/users, routes/api/decks, routes/api/cards. I think that this
    may help to isolate issues and prevent us from working on the same files at the same time.
*/

const db = require("../models");

module.exports = function(app) {
    app.post("/api/users", function(req, res) {
        let newUser = new db.User();
        req.body.user_password = newUser.genHash(req.body.user_password);
        db.User.create(req.body).then(function(results) {
            res.json(results);
        })
    })
    //route hit when a user logs in
    app.post("/api/login", function(req, res) {
        //use sequelize to find their account by name
        db.User.findOne({where: {user_name: req.body.user_name}}).then(user => {
            //then using a method created on the user model authorizes and checks hashed password and if it returns true(correct password) send back that they are authorized
            if (user.Authorize(req.body.user_password)) {
                //sends back whether the user is authorized
                res.cookie("user_password", req.body.user_password, {maxAge: 1000 * 60 * 60 * 24});
                res.cookie("user_name", req.body.user_name, {maxAge: 1000 * 60 * 60 *24});
                res.json({Auth: true});
            } else {
                //TODO => create logic for if the password is wrong here
                console.log("not auth")
            }
        })
    })
    // Get all decks for a given user
    app.get("/api/users/:id", (req,res) => {
        db.User.findOne({
            where: {
                user_id: req.params.id
            },
            include: [{
                model: db.Deck
            }]
        }).then( user => {
            res.json( user )
        });
    });
    // Add a deck to a user. Requires the following req object:
    /*{
        user_id: (integer),
        deck_name: (integer),
    }*/
    app.post("/api/decks", (req, res) => {
        db.Deck
        .create( req.body )
        .then( result => {
            res.json( result );
        });
    });

    // TODO Add a card to a user's deck. Requires the following req object:
    /*{

    }*/
    /* app.post("/api/decks/", (req, res) => {

    }); */

    // Add cards to the database. Requires at least the following fields in the req object:
    /* {
        card_id: (integer),
        card_name: (string)
    } */
    app.post("/api/cards", (req, res) => {
        db.Card
        .create( req.body )
        .then ( card => {
            res.json( card );
            console.log( card.get("card_name") + " created." );
        });
    });

    // TODO Delete deck from a user's account
    /* {

    } */
    /* app.delete("/api/decks", (req, res) => {

    }); */

    // TODO Delete card from a user's deck
    /* {

    } */
    /* app.delete("/api/decks", (req, res) => {

    }); */
};