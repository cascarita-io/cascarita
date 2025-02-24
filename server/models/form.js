"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Form.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "id",
      });
      Form.belongsTo(models.User, {
        foreignKey: "created_by",
        targetKey: "id",
      });
      Form.belongsTo(models.User, {
        foreignKey: "updated_by",
        targetKey: "id",
      });
      Form.belongsTo(models.FormType, {
        foreignKey: "form_type",
        targetKey: "id",
      });
      Form.hasMany(models.FormPaymentIntents, {
        foreignKey: "form_id",
        sourceKey: "id",
      });
    }
  }
  Form.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      document_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      form_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Form",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Form;
};
