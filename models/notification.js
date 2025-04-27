"use strict";
const { Model } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
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

  Notification.afterCreate((notification) => {
    const { object, entry } = notification.data;

    if (object !== "whatsapp_business_account") {
      return;
    }

    const { changes } = entry[0];
    const { value } = changes[0];

    if (!value.messages) {
      return;
    }

    const { id: mid, from, timestamp, type, text, image } = value.messages[0];
    sequelize.models.Message.create({ mid, from, timestamp, type, text, image })
      .then(() => {
        console.log("Message saved successfully");
      })
      .catch((err) => {
        console.error("Error saving message:", err);
      });
  });

  return Notification;
};
