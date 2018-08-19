module.exports = function (sequelize, DataTypes) {
    const Collection = sequelize.define("Collection", {
        /* user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, */
        card_quantity: {
            type: DataTypes.INTEGER,
            max: 4
        }
    });
/* 
    Collection.associate = function (models) {
        Collection.belongsTo(models.Card, {
            foreignKey: "card_id"
        });
    };
    
    Collection.associate = function (models) {
        Collection.belongsTo(models.User, {
            foreignKey: "user_id"
        });
    };
 */
    return Collection;
};