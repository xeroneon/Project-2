module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        user_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        // TODO: Research whether or not we should use UUIDs and/or a password column
        /* uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        }, */
        /* user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        }, */
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
            onDelete: "cascade"
        });
    };

    return User;
};