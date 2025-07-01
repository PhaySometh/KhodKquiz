export default (sequelize, DataTypes) => {
    return sequelize.define('UserProfile', {
    bio: DataTypes.TEXT,
    avartar_url: DataTypes.STRING,
    phone_number: DataTypes.STRING
    });
};