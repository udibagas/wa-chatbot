const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/messages", require("./messages"));
router.use("/notifications", require("./notifications"));
router.use("/complaints", require("./complaints"));
router.use("/report", require("./report"));

module.exports = router;
