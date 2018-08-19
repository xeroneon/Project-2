// TODO: See if it's possible to define a column as a foreign key to another table in its definition
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
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
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