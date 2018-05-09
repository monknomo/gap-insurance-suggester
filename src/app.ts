import * as express from "express";
import * as bodyParser from "body-parser";
import {Response, Request, NextFunction} from "express";
import Suggester from './Suggester';

// Create Express server
const app = express();


// Express configuration
app.set("port", 8000);
app.use(bodyParser());
/**
 * Primary app routes.
 */
app.post("/api/v1/products/gap/eligibility", (req: Request, res: Response) => {
    if (req.headers["content-type"] === "application/json") {
        res.setHeader("Content-Type", "application/json");
        res.send(Suggester.suggest(req.body));
    } else {
        res.status(415).send("Only application/json content accepted here");
    }
});


export default app;