const router = require("express").Router();
const token = process.env.TOKEN || "default_token";

router
  // webhook verification
  .get("/", function (req, res) {
    if (req.query["hub.verify_token"] === token) {
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      res.sendStatus(403);
    }
  })

  // webhook endpoint
  .post("/", function (req, res) {
    res.sendStatus(200);
  });

module.exports = router;
