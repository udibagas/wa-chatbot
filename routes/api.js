const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/messages", require("./messages"));
router.use("/notifications", require("./notifications"));

module.exports = router;
