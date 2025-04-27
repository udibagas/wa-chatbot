"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MediaAttachment extends Model {
    static associate(models) {
      MediaAttachment.belongsTo(models.Complaint, {
        foreignKey: "ComplaintId",
      });
    }
  }

  MediaAttachment.init(
    {
      ComplaintId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      type: DataTypes.STRING,
      caption: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "MediaAttachment",
      updatedAt: false,
    }
  );

  return MediaAttachment;
};
