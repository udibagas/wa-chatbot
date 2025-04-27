"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // define association here
    }
  }

  Notification.init(
    {
      data: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Notification",
      updatedAt: false,
    }
  );

  Notification.afterCreate(async (notification) => {
    const { object, entry } = notification.data;

    if (object !== "whatsapp_business_account") {
      return;
    }

    const { changes } = entry[0];
    const { value } = changes[0];

    if (!value.messages) {
      return;
    }

    const {
      id: mid,
      from,
      timestamp,
      type,
      text,
      image,
      location,
      interactive,
    } = value.messages[0];

    sequelize.models.Message.create({
      mid,
      from,
      timestamp,
      type,
      message: text || image || location || interactive,
    })
      .then(() => console.log("Message saved successfully"))
      .catch((err) => console.error("Error saving message:", err));
  });

  return Notification;
};
