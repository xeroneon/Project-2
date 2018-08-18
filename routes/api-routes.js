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
        //use sequelize to find their account by email
        db.User.findOne({where: {user_email: req.body.user_email}}).then(user => {
            //then using a method created on the user model authorizes and checks hashed password and if it returns true(correct password) send back that they are authorized
            if (user.Authorize(req.body.user_password)) {
                //sends back whether the user is authorized
                res.json({Auth: true})
            } else {
                //TODO => create logic for if the password is wrong here
                console.log("not auth")
            }
        })
    })
    app.get("/api/users/:id", (req,res) => {
        db.User.findOne({
            where: {
                user_id: req.params.id
            },
            include: [db.Deck]
        }).then( user => {
            res.json( user )
        });
    });
};