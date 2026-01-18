# E-commerce Orders & Analytics API

## Tech Stack
- Node.js
- Express.js
- File-based storage (db.json)

## Features
- Product Management
- Order Lifecycle Management
- Stock Management
- Revenue Analytics using Higher Order Functions

## APIs

### Products
- POST /products
- GET /products

### Orders
- POST /orders
- GET /orders
- DELETE /orders/:id
- PATCH /orders/change-status/:id

### Analytics
- GET /analytics/allorders
- GET /analytics/cancelled-orders
- GET /analytics/shipped
- GET /analytics/total-revenue/:productId
- GET /analytics/alltotalrevenue

## Rules Followed
- No external database used
- Soft delete implemented
- Stock restored on cancellation
- Revenue calculated using formula
- map, filter, reduce used for analytics

## How to Run
```bash
npm install
node index.js
