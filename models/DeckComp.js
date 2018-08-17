module.exports = function (sequelize, DataTypes) {
    const DeckComp = sequelize.define("DeckComp", {
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
            allowNull: false,
            max: 4
        }
    });

    DeckComp.associate = function (models) {
        DeckComp.belongsTo(models.Card, {
            onDelete: "cascade"
        });
    };

    DeckComp.associate = function (models) {
        DeckComp.belongsTo(models.Deck, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return DeckComp;
};