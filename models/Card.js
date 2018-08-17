module.exports = function (sequelize, DataTypes) {
    const Card = sequelize.define("Card", {
        card_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        card_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        card_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_edition: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_artist: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_mana_cost: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_rarity: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    Card.associate = function (models) {
        Card.hasMany(models.DeckComp, {
            onDelete: "cascade"
        });
    };

    return Card;
};