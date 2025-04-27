"use strict";
const { Model } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
const useWa = require("../services/wa.service");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
    }

    async downloadMedia() {
      const { data } = await axios.get(
        `https://${process.env.WA_BASE_URL}/${process.env.CLOUD_API_VERSION}/${this.message.id}`,
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
      const path = `media/${ymd}/${this.message.id}.jpg`;
      res.data.pipe(fs.createWriteStream(path));
      await this.update({ mediaUrl: path });
      return path;
    }

    sendWelcome() {
      const wa = useWa();

      const list = {
        type: "list",
        header: {
          type: "text",
          text: "Selamat Datang!",
        },
        body: {
          text: "Selamat datang di layanan pengaduan kami. Apa yang ingin Anda laporkan?",
        },
        footer: {
          text: "FOOTER_TEXT",
        },
        action: {
          button: "BUTTON_TEXT",
          sections: [
            {
              title: "SECTION_1_TITLE",
              rows: [
                {
                  id: "SECTION_1_ROW_1_ID",
                  title: "SECTION_1_ROW_1_TITLE",
                  description: "SECTION_1_ROW_1_DESCRIPTION",
                },
                {
                  id: "SECTION_1_ROW_2_ID",
                  title: "SECTION_1_ROW_2_TITLE",
                  description: "SECTION_1_ROW_2_DESCRIPTION",
                },
              ],
            },
            {
              title: "SECTION_2_TITLE",
              rows: [
                {
                  id: "SECTION_2_ROW_1_ID",
                  title: "SECTION_2_ROW_1_TITLE",
                  description: "SECTION_2_ROW_1_DESCRIPTION",
                },
                {
                  id: "SECTION_2_ROW_2_ID",
                  title: "SECTION_2_ROW_2_TITLE",
                  description: "SECTION_2_ROW_2_DESCRIPTION",
                },
              ],
            },
          ],
        },
      };

      wa.messages.interactive(list, this.from);
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
      await message.downloadMedia();
      await message.reload();
    }

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
      message.sendWelcome();
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
      }[message.message.body];

      if (!type) {
        session.sendInvalidResponse();
        return;
      }

      currentState = "type";
      updatedContext.type = type;
      message.sendResponse(`${type}/title`);
    }

    if (session.currentState === "type") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "title";
      updatedContext.title = message.message.body;
      message.sendResponse(`${session.context.type}/description`);
    }

    if (session.currentState === "title") {
      if (message.type !== "text") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "description";
      updatedContext.description = message.message.body;
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
      }[message.message.body];

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
      updatedContext.location = message.message;
      message.sendResponse("attachment");
    }

    if (session.currentState === "location") {
      if (message.type !== "image") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "attachment";
      updatedContext.attachments = [];
      updatedContext.attachments.push(message.mediaUrl);
    }

    if (session.currentState === "attachment") {
      // attach more images
      if (message.type === "image") {
        updatedContext.attachments = session.context.attachments || [];
        updatedContext.attachments.push(message.mediaUrl);
      } else {
        // end session
        active = false;
      }
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

    if (!session.active) {
      const { type, title, description, attachments, location, priority } =
        session.context;

      await sequelize.models.Complaint.create({
        from: session.from,
        type,
        title,
        description,
        attachments,
        location,
        priority,
      });

      message.sendResponse("thankyou");
      await session.destroy();
    }
  });

  return Message;
};
