"use strict";
const { Model } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
    }
  }

  Message.init(
    {
      mid: DataTypes.STRING,
      from: DataTypes.STRING,
      timestamp: DataTypes.INTEGER,
      type: DataTypes.STRING,
      text: DataTypes.JSON,
      image: DataTypes.JSON,
      mediaUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      updatedAt: false,
    }
  );

  Message.afterCreate((message) => {
    sendWhatsAppMessage({
      message:
        "Terimakasih telah menghubungi kami.\nKami akan segera menindaklanjuti pesan Anda.\n\n*LaporKami*",
      phoneNumber: message.from,
      type: "text",
    })
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });
  });

  return Message;
};
