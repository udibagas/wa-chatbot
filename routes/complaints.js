const { Op } = require("sequelize");
const { auth } = require("../middlewares/auth.middleware");
const { Complaint } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, pageSize: limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      order: [["createdAt", "desc"]],
      limit: +limit,
      offset,
    };

    if (search) {
      options.where = {
        [Op.or]: [
          { id: search },
          { from: { [Op.iLike]: `%${search}%` } },
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    try {
      const { count: total, rows } = await Complaint.findAndCountAll(options);
      res.status(200).json({
        total,
        page: +page,
        rows,
        from: offset + 1,
        to: offset + rows.length,
      });
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const complaint = await Complaint.findByPk(req.params.id);

      if (!complaint) {
        const error = new Error("Complaint not found");
        error.status = 404;
        throw error;
      }

      await complaint.update(req.body);
      await complaint.reload();
      res.status(200).json(complaint);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const complaint = await Complaint.findByPk(req.params.id);

      if (!complaint) {
        const error = new Error("Complaint not found");
        error.status = 404;
        throw error;
      }

      await complaint.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
