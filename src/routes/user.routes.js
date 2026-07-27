const router = require("express").Router();

const controller = require("../controllers/user.controller");
const authorize = require("../middleware/role.middleware");

router.get(
    "/",
    authorize("ADMIN"),
    controller.getAll
);

router.get(
    "/:id",
    authorize("ADMIN", "CUSTOMER"),
    controller.getById
);

module.exports = router;