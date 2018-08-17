const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        }
    });

    User.prototype.genHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    User.prototype.Authorize = function (password) {
        return bcrypt.compareSync(password, this.user_password);
    }

    return User;
};