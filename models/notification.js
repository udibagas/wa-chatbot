"use strict";
const fs = require("fs");
const { Model } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
const { defaults } = require("pg");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // define association here
    }

    static sendResponse(phoneNumber, template) {
      fs.readFile(`./templates/${template}.txt`, "utf-8", (err, message) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }

        sendWhatsAppMessage({
          type: "text",
          phoneNumber,
          message,
        });
      });
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
    } = value.messages[0];

    sequelize.models.Message.create({
      mid,
      from,
      timestamp,
      type,
      message: text || image || location,
    })
      .then(() => console.log("Message saved successfully"))
      .catch((err) => console.error("Error saving message:", err));

    // Cari session yang masih aktif atau create session
    const [session, created] = await sequelize.models.Session.findOrCreate({
      where: {
        from: from,
        active: true,
      },
      defaults: {
        from,
        currentState: "initiated",
        context: {},
        active: true,
      },
    });

    // Jika session baru, kirim pesan sambutan
    if (created) {
      Notification.sendResponse(from, "welcome");
      return;
    }

    // Jika ada session, update session
    let currentState = session.currentState;
    let active = session.active;
    const updatedContext = {};

    if (session.currentState === "initiated") {
      if (type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      const type = {
        1: "accident",
        2: "criminal",
        3: "environment",
        4: "infrastucture",
        5: "other",
      }[text.body];

      if (!type) {
        session.sendInvalidResponse();
        return;
      }

      currentState = "type";
      updatedContext.type = text.body;
      Notification.sendResponse(from, `${type}/title`);
    }

    if (session.currentState === "type") {
      if (type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "title";
      updatedContext.title = text.body;
      Notification.sendResponse(from, `${session.context.type}/description`);
    }

    if (session.currentState === "title") {
      if (type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "description";
      updatedContext.description = text.body;
      Notification.sendResponse(from, "priority");
    }

    if (session.currentState === "description") {
      if (type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      const priority = {
        1: "low",
        2: "medium",
        3: "high",
        4: "urgent",
      }[text.body];

      if (!priority) {
        session.sendInvalidResponse();
        return;
      }

      currentState = "priority";
      updatedContext.priority = priority;
      Notification.sendResponse(from, "location");
    }

    if (session.currentState === "priority") {
      if (type !== "location") {
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

      Notification.sendResponse(from, "thankyou");
      await session.destroy();
    }
  });

  return Notification;
};
