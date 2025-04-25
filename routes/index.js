var express = require("express");
const { auth } = require("../middlewares/auth.middleware");
var router = express.Router();

router.use(require("./auth"));
router.use("/webhook", require("./webhook"));

router.use("/wa", auth, require("./wa"));
router.use("/api", auth, require("./api"));

module.exports = router;
