export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    total_score: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
};