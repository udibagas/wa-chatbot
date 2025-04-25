const router = require("express").Router();
const token = process.env.TOKEN || "default_token";
const { Notification } = require("../models");

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
    res.sendStatus(200);
  });

module.exports = router;
