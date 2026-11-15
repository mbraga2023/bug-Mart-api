const router = require("express").Router();
const controller = require("../controllers/cart.controller");
const validateBody = require("../middleware/validate-body.middleware");
const {
    createCartBody,
    cartItemBody,
    updateCartItemBody,
    associateCartBody
} = require("../validators/request.validator");

router.post("/", validateBody(createCartBody, { optional: true }), controller.createCart);
router.get("/:cartId", controller.getCart);
router.post("/:cartId/items", validateBody(cartItemBody), controller.addItem);
router.put("/:cartId/items/:productId", validateBody(updateCartItemBody), controller.updateItem);
router.delete("/:cartId/items/:productId", controller.removeItem);
router.delete("/:cartId/items", controller.clearCart);
router.post("/:cartId/login", validateBody(associateCartBody), controller.loginCart);
router.delete("/:cartId", controller.deleteCart);

module.exports = router;