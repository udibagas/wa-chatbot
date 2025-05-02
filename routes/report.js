const router = require("express").Router();
const { Complaint, sequelize } = require("../models");

router.get("/by-status", async (req, res, next) => {
  try {
    const reports = await Complaint.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: "status",
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

router.get("/by-type", async (req, res, next) => {
  try {
    const reports = await Complaint.findAll({
      attributes: [
        "type",
        [sequelize.fn("COUNT", sequelize.col("type")), "count"],
      ],
      group: "type",
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

router.get("/by-region", async (req, res, next) => {
  try {
    const reports = await Complaint.findAll({
      attributes: [
        "region",
        [sequelize.fn("COUNT", sequelize.col("region")), "count"],
      ],
      group: "region",
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

router.get("/by-priority", async (req, res, next) => {
  try {
    const reports = await Complaint.findAll({
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("priority")), "count"],
      ],
      group: "priority",
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
