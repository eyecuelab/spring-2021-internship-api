import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import session from "express-session";

import express, { Request, Response, NextFunction } from "express";
import { getConnection } from "typeorm";
import { User } from "./entities/User";
import { BAD_REQUEST } from "http-status-codes";
import cors from "cors";

import BaseRouter from "./routes";
import logger from "./shared/Logger";

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

// Init express
const app = express();
//Init Session
const sess = {
  userId: 0,
  cookie: {},
  secret: "This is super secret",
};

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));
app.use(async (req, res, next) => {
  const user = await getConnection()
    .getRepository(User)
    .findOne(req.session.userId);
  req.user = user;
  next();
});

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));
app.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: viewsDir });
});

// Export express instance
export default app;
