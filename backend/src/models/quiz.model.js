export default (sequelize, DataTypes) => {
  return sequelize.define('Quiz', {
    quiz_code: DataTypes.STRING,
    score: DataTypes.INTEGER,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
  });
};