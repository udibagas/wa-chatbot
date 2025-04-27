"use strict";
const { Model } = require("sequelize");
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
      });
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
