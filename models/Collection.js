module.exports = function (sequelize, DataTypes) {
    const Collection = sequelize.define("Collection", {
        user_id: {
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

    Collection.associate = function (models) {
        Collection.belongsTo(models.Card, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade"
        });
    };
    
    Collection.associate = function (models) {
        Collection.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "cascade"
        });
    };

    return Collection;
};