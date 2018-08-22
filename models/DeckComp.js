module.exports = function (sequelize, DataTypes) {
    const DeckComp = sequelize.define("DeckComp", {
        card_quantity: {
            type: DataTypes.INTEGER
        }
    });
  
    return DeckComp;
};