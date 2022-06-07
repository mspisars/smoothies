'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instruction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Instruction.init({
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Instruction',
    tableName: 'instructions'
  });
  return Instruction;
};
