'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // user to recipes
      models.User.hasMany(this, { 
        foreignKey: 'username',
      });
      this.belongsTo(models.User, {
        foreignKey: 'username',
      });
      // recipes to ingredients
      this.hasMany(models.Ingredient, {
        as: 'ingredients',
        onDelete: 'CASCADE'
      });
      models.Ingredient.belongsTo(this);
      // recipes to instructions
      this.hasMany(models.Instruction, {
        as: 'instructions',
        onDelete: 'CASCADE'
      });
      models.Instruction.belongsTo(this);
      // shared/published
      this.hasOne(models.Published, {
        as: 'published',
        onDelete: 'CASCADE'
      });
      models.Published.belongsTo(this);

    }
  }
  Recipe.init({
    recipe_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    serving: DataTypes.INTEGER,
     // Set FK relationship (hasMany) with `User`
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      }
    }
  }, {
    sequelize,
    modelName: 'Recipe',
    tableName: 'recipes'
  });

  Recipe.beforeValidate((recipe, options) => {
    // remove all non alph-numeric chars - makes it clean for a human readable URL
    if (recipe.recipe_id) return;
    recipe.recipe_id = (recipe.name.trim()).toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/gi, '');
  });

  return Recipe;
};
