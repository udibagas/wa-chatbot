var express = require("express");
const { auth } = require("../middlewares/auth.middleware");
var router = express.Router();

router.use(require("./auth"));
router.use("/webhook", require("./webhook"));

router.use(auth);
router.use("/wa", require("./wa"));

module.exports = router;
