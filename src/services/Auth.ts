import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { OAuth2Client } from "google-auth-library";
import passport from "passport";
import { v4 } from "uuid";

/******************************************************************************
 *                      Authenticate User - "POST /api/v1/auth/google"
 ******************************************************************************/

export const auth = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const email = payload?.email;
  const firstName = payload?.given_name;
  const lastName = payload?.family_name;

  const existingUser = await getConnection()
    .getRepository(User)
    .findOne({
      where: { email: email },
    });

  if (existingUser) {
    passport.authenticate("google", function (req, res) {
      res.redirect("/users/" + req.user);
      res.cookie("userid", req.user.uuid);
    });
    return res.status(OK).json({ existingUser });
    // const existingUUID = user.uuid;
    // req.session.userId = user.uuid;
    // const existingUser = await getConnection()
    //   .getRepository(User)
    //   .findOne({ where: { uuid: existingUUID } });
    // req.user = existingUser;
    // return res.status(OK).json({ existingUser });
  }

  if (!existingUser) {
    const newUser = await getConnection().getRepository(User).save({
      uuid: v4(),
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
    req.session.userId = newUser.uuid;
    req.user = newUser;
    res.cookie("userid", req.user.uuid);
    return res.status(OK).json({ newUser });
  }
};

/******************************************************************************
 *                      Sign User Out - "DELETE /api/v1/auth/google"
 ******************************************************************************/

export const signOut = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  console.log(req.session.userId);
  const { user } = req;
  await req.session.destroy(function () {
    console.log({ loggedUser: user });
  });
  console.log(req.session);
  return res.status(OK).json({ message: "User Signed Out" });
};

export default {
  auth,
  signOut,
};
