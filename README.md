# BugMart API

A small in-memory ecommerce API for the BugMart QA playground. Catalog data is seeded from `src/data`; carts and orders are held in memory and reset when the server restarts.

## Run

```sh
npm install
npm run dev
```

The API listens on `http://localhost:3000`. Check `GET /health` for service status.
Product illustrations are original local SVGs served from `/images/products`. Regenerate them with `npm run generate:images`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/products` | List products; accepts `page`, `limit`, `q`, `categoryId`, `minPrice`, `maxPrice`, and `sort` (`price_asc`, `price_desc`, `name_asc`, `name_desc`, `rating_desc`) |
| `GET` | `/api/products/:id` | Get a product |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/categories/:id` | Get a category |
| `GET` | `/api/users` | List users (admin role) |
| `GET` | `/api/users/:id` | Get a user (admin or customer role) |
| `POST` | `/api/cart` | Create a guest cart, or a cart linked to a `userId` |
| `GET` | `/api/cart/:cartId` | Get cart items and totals |
| `POST` | `/api/cart/:cartId/items` | Add `{ "productId": 1, "quantity": 2 }` |
| `PUT` | `/api/cart/:cartId/items/:productId` | Set item quantity with `{ "quantity": 1 }` |
| `DELETE` | `/api/cart/:cartId/items/:productId` | Remove an item |
| `DELETE` | `/api/cart/:cartId/items` | Empty a cart |
| `POST` | `/api/cart/:cartId/login` | Associate a cart with `{ "userId": 1 }` |
| `DELETE` | `/api/cart/:cartId` | Delete a cart |
| `POST` | `/api/orders` | Checkout with `{ "cartId": "cart-1" }` |
| `GET` | `/api/orders` | List orders for the current user |
| `GET` | `/api/orders/:id` | Get one of the current user's orders |
| `POST` | `/api/payments` | Mock checkout with `{ "cartId": "cart-1", "paymentMethod": "card" }`; optional `mockOutcome: "refused"` simulates a declined payment |

Authentication is currently a fake development middleware: `x-user-id` selects a seeded user and defaults to user `1`. Replace it with real authentication before production use.

Mock payments accept `card` or `pix`. Successful payments create a confirmed order, reduce stock, and empty the cart. A refused payment returns `402 Payment refused` and leaves the cart untouched. Do not send real card details; this endpoint does not process payments.

Request errors use JSON with `success: false`, `code`, and `message`. Invalid JSON returns `400 INVALID_JSON`; invalid body shapes return `400 VALIDATION_ERROR` with field details; stock conflicts return `409 OUT_OF_STOCK`. Unexpected server failures return `500 INTERNAL_ERROR` with the generic message `Internal server error`.

## Tests

```sh
npm test
```
