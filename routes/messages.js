const { default: axios } = require("axios");
const { auth } = require("../middlewares/auth.middleware");
const { Message } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, pageSize: limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      order: [["createdAt", "desc"]],
      limit: +limit,
      offset,
    };

    try {
      const { count: total, rows } = await Message.findAndCountAll(options);
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

  .post("/", async (req, res, next) => {
    try {
      const user = await Message.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const user = await Message.findByPk(req.params.id);

      if (!user) {
        const error = new Error("Message not found");
        error.status = 404;
        throw error;
      }

      await user.update(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const user = await Message.findByPk(req.params.id);

      if (!user) {
        const error = new Error("Message not found");
        error.status = 404;
        throw error;
      }

      await user.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  })

  .get("/image/:id", async (req, res, next) => {
    axios
      .get(
        `https://${process.env.WA_BASE_URL}/${process.env.CLOUD_API_VERSION}/${req.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`,
          },
        }
      )
      .then((response) => {
        // TODO: download image
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        res.status(500).json({ error: "Failed to fetch image" });
      });
  });

module.exports = router;
