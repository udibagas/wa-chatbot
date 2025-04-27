"use strict";
const { Model } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

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
      return path;
    }

    sendResponse(template) {
      fs.readFile(`./templates/${template}.txt`, "utf-8", (err, message) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }

        sendWhatsAppMessage({
          type: "text",
          phoneNumber: this.from,
          message,
        })
          .then(() => console.log("Response sent successfully"))
          .catch((err) => console.error("Error sending response:", err));
      });
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

  Message.afterCreate(async (message) => {
    if (message.type === "image") {
      message
        .downloadMedia()
        .then(() => console.log("Image downloaded successfully"))
        .catch((err) => console.error("Error downloading image:", err));
    }

    console.log(message.body, "<< message.body");

    // Cari session yang masih aktif atau create session
    const [session, created] = await sequelize.models.Session.findOrCreate({
      where: {
        from: message.from,
        active: true,
      },
      defaults: {
        from: message.from,
        currentState: "initiated",
        context: {},
        active: true,
      },
    });

    // Jika session baru, kirim pesan sambutan
    if (created) {
      message.sendResponse("welcome");
      return;
    }

    // Jika ada session, update session
    let currentState = session.currentState;
    let active = session.active;
    const updatedContext = {};

    if (session.currentState === "initiated") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      const type = {
        1: "accident",
        2: "criminal",
        3: "environment",
        4: "infrastucture",
        5: "other",
      }[message.body];

      if (!type) {
        session.sendInvalidResponse();
        return;
      }

      currentState = "type";
      updatedContext.type = message.body;
      message.sendResponse(`${message.type}/title`);
    }

    if (session.currentState === "type") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "title";
      updatedContext.title = message.body;
      message.sendResponse(`${session.context.type}/description`);
    }

    if (session.currentState === "title") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "description";
      updatedContext.description = message.body;
      message.sendResponse("priority");
    }

    if (session.currentState === "description") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      const priority = {
        1: "low",
        2: "medium",
        3: "high",
        4: "urgent",
      }[message.body];

      if (!priority) {
        session.sendInvalidResponse();
        return;
      }

      currentState = "priority";
      updatedContext.priority = priority;
      message.sendResponse("location");
    }

    if (session.currentState === "priority") {
      if (message.type !== "location") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "location";
      updatedContext.location = location;
    }

    if (session.currentState === "location") {
      // TODO: get attachment and save to database
      active = false;
    }

    await session.update({
      active: active,
      currentState: currentState,
      context: {
        ...session.context,
        ...updatedContext,
      },
    });

    await session.reload();

    if (!active) {
      const { type, title, description, location, priority } = session.context;

      await sequelize.models.Complaint.create({
        from,
        type,
        title,
        description,
        location,
        priority,
      });

      message.sendResponse("thankyou");
      await session.destroy();
    }
  });

  return Message;
};
