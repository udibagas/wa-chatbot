const router = require("express").Router();
const token = process.env.TOKEN || "default_token";
const { Notification, Message } = require("../models");

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
    await Notification.create({ data: req.body });
    const { object, entry } = req.body;

    if (object !== "whatsapp_business_account") {
      return res.sendStatus(400);
    }

    const { changes } = entry[0];
    const { value } = changes[0];

    const { id: mid, from, timestamp, type, text, image } = value.messages[0];
    await Message.create({
      mid,
      from,
      timestamp,
      type,
      text,
      image,
    });

    res.sendStatus(200);
  });

module.exports = router;
