module.exports = function (sequelize, DataTypes) {
    const DeckComp = sequelize.define("Deck", {
        deck_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        card_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
            // TODO: limit quantity to 60
        }
    });

    Deck.associate = function (models) {
        Deck.hasMany(models.DeckComp, {
            onDelete: "cascade"
        });
    };

    Deck.associate = function (models) {
        Deck.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Deck;
};