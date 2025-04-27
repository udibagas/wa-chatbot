"use strict";
const { Model } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
    }

    async downloadMedia() {
      const { data } = await axios.get(
        `https://${process.env.WA_BASE_URL}/${process.env.CLOUD_API_VERSION}/${this.image.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`,
          },
        }
      );

      const res = await axios.get(data.url, {
        responseType: "stream",
        headers: {
          Authorization: `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`,
        },
      });

      const ymd = moment().format("YYYY/MM/DD");
      fs.mkdirSync(`./media/${ymd}`, { recursive: true });
      const path = `media/${ymd}/${this.image.id}.jpg`;
      res.data.pipe(fs.createWriteStream(path));
      await this.update({ mediaUrl: path });
    }
  }

  Message.init(
    {
      mid: DataTypes.STRING,
      from: DataTypes.STRING,
      timestamp: DataTypes.INTEGER,
      type: DataTypes.STRING,
      message: DataTypes.JSON,
      mediaUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      updatedAt: false,
    }
  );

  Message.afterCreate((message) => {
    if (message.type === "image") {
      message
        .downloadMedia()
        .then(() => console.log("Image downloaded successfully"))
        .catch((err) => console.error("Error downloading image:", err));
    }
  });

  return Message;
};
