const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        user_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        user_first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_last_name: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Deck, {
            foreignKey: "user_id"
        });
    };

    User.prototype.genHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    };

    User.prototype.Authorize = function (password) {
        return bcrypt.compareSync(password, this.user_password);
    };

    return User;
};