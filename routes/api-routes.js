var db = require("../models");

module.exports = function(app) {
    app.get("/users/:userid", (req, res) => {
        db.User.findOne({
            where: {
                id: req.params.id
            }
        }).then( user => {
            console.log( user );
            res.json( user )
        } )
    });
};