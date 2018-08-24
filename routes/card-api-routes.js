const db = require("../models");
const mtg = require("mtgsdk");

module.exports = function (app) {
    
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
                    cardText: card.text,
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
                card_text: thisCard.cardText,
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
        })
        .catch( err => {
            res.json({
                error: true
            });
            console.log("Something went wrong.\n", err);
        });
    });
};