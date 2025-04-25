const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components = [],
    } = req.body;

    const payload = {
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components,
    };

    const body = await sendWhatsAppMessage(payload);
    console.log(body);
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
