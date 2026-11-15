const router = require("express").Router();
const controller = require("../controllers/order.controller");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

module.exports = router;
