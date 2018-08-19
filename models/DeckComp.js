module.exports = function (sequelize, DataTypes) {
    const DeckComp = sequelize.define("DeckComp", {
        deck_comp_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    });

    DeckComp.associate = function (models) {
        DeckComp.hasMany(models.Card, {
            foreignKey: {
                allowNull: false
            }
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