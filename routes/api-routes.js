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
                model: db.Card
            }]
        }).then( user => {
            res.json( user )
        });
    });
    // Add a card to a user's collection. Requires the following req object:
    /*{
        user_id: (integer),
        card_id: (integer),
        card_quantity: (integer)
    }*/
    app.post("/api/collections", (req, res) => {
        db.Collection
        .create( req.body )
        .then( result => {
            res.json( result );
        });
    });
    // Add cards to database. Requires at least the following fields in the req object:
    /* {
        card_id: (integer),
        card_name: (string)
    } */
    app.post("/api/cards/create", (req, res) => {
        db.Card
        .create( req.body )
        .then ( card => {
            res.json( card );
            console.log( card.get("card_name") + " created." );
        });
    });
};