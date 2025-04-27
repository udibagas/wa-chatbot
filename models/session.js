"use strict";
const { Model } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
    }

    sendInvalidResponse() {
      sendWhatsAppMessage({
        phoneNumber: this.from,
        type: "text",
        message: "Jawaban tidak sesuai, silakan coba lagi.",
      })
        .then(() => console.log("Invalid response sent successfully"))
        .catch((err) => console.error("Error sending invalid response:", err));
    }
  }

  Session.init(
    {
      from: DataTypes.STRING,
      currentState: DataTypes.STRING,
      context: DataTypes.JSON,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Session",
    }
  );

  return Session;
};
