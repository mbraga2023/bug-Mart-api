const router = require("express").Router();
const controller = require("../controllers/cart.controller");

router.post("/", controller.createCart);
router.get("/:cartId", controller.getCart);
router.post("/:cartId/items", controller.addItem);
router.put("/:cartId/items/:productId", controller.updateItem);
router.delete("/:cartId/items/:productId", controller.removeItem);
router.delete("/:cartId/items", controller.clearCart);
router.post("/:cartId/login", controller.loginCart);
router.delete("/:cartId", controller.deleteCart);

module.exports = router;