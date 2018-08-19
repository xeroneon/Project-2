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