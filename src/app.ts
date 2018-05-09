import * as express from "express";
import { Response, Request, NextFunction } from "express";

// Create Express server
const app = express();


// Express configuration
app.set("port", 8000);
// app.set("view engine", "pug");
/**
 * Primary app routes.
 */
app.get("/api/v1/products/gap/eligibility", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ "eligible": true }));
});


export default app;