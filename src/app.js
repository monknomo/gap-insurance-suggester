"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// Create Express server
const app = express();
// Express configuration
app.set("port", 8000);
// app.set("view engine", "pug");
/**
 * Primary app routes.
 */
app.get("/api/v1/products/gap/eligibility", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ "eligible": true }));
});
exports.default = app;
//# sourceMappingURL=app.js.map