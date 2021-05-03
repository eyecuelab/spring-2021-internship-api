import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import session from "express-session";

import express, { Request, Response, NextFunction } from "express";
// import { getConnection } from "typeorm";
import { User } from "./entities/User";
import { BAD_REQUEST } from "http-status-codes";
import cors from "cors";
import passport from "passport";
import passportGoogle from "passport-google-oauth";

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

// declare global {
//   namespace Express {
//     interface User {
//       uuid: string;
//     }
//   }
// }

// Init express
const app = express();
//Init Session
// const sess = {
//   cookie: {},
//   secret: "This is super secret",
// };

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

let userProfile: any;

app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, done) {
  // console.log({ serializeUser: user });
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

const GOOGLE_CLIENT_ID: string = process.env.CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET: string = process.env.CLIENT_SECRET ?? "";
const GoogleStrategy = passportGoogle.OAuth2Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth",
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }),
      //   function (err, user) {
      //     return done(err, user);
      //   };
      userProfile = profile;
      console.log({ userProfile: userProfile });
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success" + req.user);
  }
);

// app.use(async (req, res, next) => {
//   const [user] = await getConnection()
//     .getRepository(User)
//     .find({ where: { uuid: req.session.userId } });
//   console.log({ user, session: req.session });
//   req.user = user;
//   next();
// });

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
