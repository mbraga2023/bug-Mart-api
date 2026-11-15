const router = require("express").Router();
const controller = require("../controllers/payment.controller");
const validateBody = require("../middleware/validate-body.middleware");
const { createPaymentBody } = require("../validators/request.validator");

router.post("/", validateBody(createPaymentBody), controller.create);

module.exports = router;
