import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { OAuth2Client } from "google-auth-library";
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

  const user = await getConnection()
    .getRepository(User)
    .findOne({
      where: { email: email },
    });

  if (user) {
    const existingUUID = user.uuid;
    req.session.userId = user.uuid;
    const existingUser = await getConnection()
      .getRepository(User)
      .findOne({ where: { uuid: existingUUID } });
    return res.status(OK).json({ existingUser });
  }
  if (!user) {
    const newUser = await getConnection().getRepository(User).save({
      uuid: v4(),
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
    req.session.userId = newUser.uuid;
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
  await req.session.destroy(() => {
    res.status(OK).json({
      message: "Logged out successfully",
    });
  });
};

export default {
  auth,
  signOut,
};
