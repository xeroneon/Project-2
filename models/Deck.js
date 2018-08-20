module.exports = function (sequelize, DataTypes) {
    const Deck = sequelize.define("Deck", {
        deck_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        deck_name: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        }
    });

    Deck.associate = function (models) {
        Deck.belongsTo(models.User, {
            foreignKey: "user_id"
        });
    };

    Deck.associate = function (models) {
        Deck.belongsToMany(models.Card, {
            through: models.DeckComp,
            foreignKey: "deck_id"
        });
    };

    return Deck;
};