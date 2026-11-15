const router = require("express").Router();
const controller = require("../controllers/order.controller");
const validateBody = require("../middleware/validate-body.middleware");
const { createOrderBody } = require("../validators/request.validator");

router.post("/", validateBody(createOrderBody), controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

module.exports = router;
