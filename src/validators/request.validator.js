const { z } = require("zod");

const createCartBody = z.object({
    userId: z.number().int().positive().nullable().optional()
}).strict();

const cartItemBody = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive()
}).strict();

const updateCartItemBody = z.object({
    quantity: z.number().int().positive()
}).strict();

const associateCartBody = z.object({
    userId: z.number().int().positive()
}).strict();

const createOrderBody = z.object({
    cartId: z.string().trim().min(1)
}).strict();

const createPaymentBody = z.object({
    cartId: z.string().trim().min(1),
    paymentMethod: z.enum(["card", "pix"]),
    mockOutcome: z.enum(["approved", "refused"]).optional()
}).strict();

module.exports = {
    createCartBody,
    cartItemBody,
    updateCartItemBody,
    associateCartBody,
    createOrderBody,
    createPaymentBody
};
