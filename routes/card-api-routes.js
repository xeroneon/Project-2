const db = require("../models");
const mtg = require("mtgsdk");

module.exports = function (app) {

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
                res.json(responseCards);
            });
    });

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

                    }).catch(err => {
                        res.json({
                            error: true
                        });
                        console.log("Something went wrong.\n", err);
                    });
            });

        });
    });
};