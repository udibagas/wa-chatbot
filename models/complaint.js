"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      Complaint.hasMany(models.MediaAttachment, {
        foreignKey: "ComplaintId",
      });
    }
  }

  Complaint.init(
    {
      from: DataTypes.STRING,
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      location: DataTypes.JSON,
      status: DataTypes.STRING,
      priority: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Complaint",
    }
  );

  return Complaint;
};
