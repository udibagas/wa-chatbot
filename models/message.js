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
          text: "Selamat datang di layanan pengaduan kami. Apa yang ingin Anda adukan?",
        },
        action: {
          button: "Pilih Jenis Aduan",
          sections: [
            {
              rows: [
                {
                  id: "accident",
                  title: "Kecelakaan",
                },
                {
                  id: "criminal",
                  title: "Tindak Kriminalitas",
                },
                {
                  id: "environment",
                  title: "Masalah Lingkungan",
                },
                {
                  id: "infrasrtucture",
                  title: "Masalah Infrastruktur",
                },
                {
                  id: "other",
                  title: "Lainnya",
                },
              ],
            },
          ],
        },
      };

      wa.messages.interactive(list, this.from);
    }

    sendPriority() {
      const wa = useWa();

      const list = {
        type: "list",
        body: {
          text: "Tentukan prioritas aduan Anda:",
        },
        action: {
          button: "Pilih Prioritas",
          sections: [
            {
              rows: [
                {
                  id: "low",
                  title: "Rendah",
                },
                {
                  id: "medium",
                  title: "Sedang",
                },
                {
                  id: "high",
                  title: "Tinggi",
                },
                {
                  id: "critical",
                  title: "Kritis",
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
      if (message.type !== "interactive") {
        session.sendInvalidResponse();
        return;
      }

      const type = message.message.list_reply.id;

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
      message.sendPriority();
    }

    if (session.currentState === "description") {
      if (message.type !== "interactive") {
        session.sendInvalidResponse();
        return;
      }

      currentState = "priority";
      updatedContext.priority = message.message.list_reply.id;
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
