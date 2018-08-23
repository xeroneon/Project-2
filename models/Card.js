module.exports = function (sequelize, DataTypes) {
    const Card = sequelize.define("Card", {
        card_id: {
            type: DataTypes.STRING,
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
        card_set: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "/images/placeholder.png"
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
        tcg_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Card.associate = function (models) {

        Card.belongsToMany(models.Deck, {
            through: models.DeckComp,
            foreignKey: "card_id"
        });
    };

/* 
    Card.beforeCreate( card => {
        Card.findOne()
        if ( [condition that returns true if the card exists] ) {
          throw new Error("Card ID already exists.")
        };
      });
 */
    return Card;
};