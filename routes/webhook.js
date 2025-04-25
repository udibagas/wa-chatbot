const router = require("express").Router();
const token = process.env.TOKEN || "default_token";
const { Notification, Message } = require("../models");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

router
  // webhook verification
  .get("/", (req, res) => {
    if (req.query["hub.verify_token"] === token) {
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      res.sendStatus(403);
    }
  })

  // webhook endpoint
  .post("/", async (req, res) => {
    Notification.create({ data: req.body })
      .then(() => {
        console.log("Notification saved successfully");
      })
      .catch((err) => {
        console.error("Error saving notification:", err);
      });

    const { object, entry } = req.body;

    if (object !== "whatsapp_business_account") {
      return res.sendStatus(400);
    }

    const { changes } = entry[0];
    const { value } = changes[0];

    const { id: mid, from, timestamp, type, text, image } = value.messages[0];
    Message.create({
      mid,
      from,
      timestamp,
      type,
      text,
      image,
    })
      .then(() => {
        console.log("Message saved successfully");
      })
      .catch((err) => {
        console.error("Error saving message:", err);
      });

    sendWhatsAppMessage({
      message: `
        Terimakasih telah menghubungi kami.
        Kami akan segera menindaklanjuti pesan Anda.

        *LaporKami*
        `,
      phoneNumber: from,
      type: "text",
    })
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });

    res.sendStatus(200);
  });

module.exports = router;
