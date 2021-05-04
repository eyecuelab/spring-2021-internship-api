import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { getConnection } from 'typeorm';
import { User } from '../entities/User';
import { OAuth2Client } from 'google-auth-library';
import { v4 } from 'uuid';

/******************************************************************************
 *                      Authenticate User - "POST /api/v1/auth/google"
 ******************************************************************************/

export const auth = async (req: Request, res: Response): Promise<Response | void> => {
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

  console.log('hmm');

  const user = await getConnection()
    .getRepository(User)
    .findOne({
      where: { email: email },
    });

  if (user) {
    req.session.userId = user.uuid;
    req.user = user;

    return res.status(OK).json({ user });
  }

  if (!user) {
    const newUser = await getConnection().getRepository(User).save({
      uuid: v4(),
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
    req.session.userId = newUser.uuid;
    req.user = newUser;
    // res.cookie('userid', req.user.uuid);
    return res.status(OK).json({ user: newUser });
  }
};

/******************************************************************************
 *                      Sign User Out - "DELETE /api/v1/auth/google"
 ******************************************************************************/

export const signOut = async (req: Request, res: Response): Promise<Response | void> => {
  console.log(req.session.userId);
  const { user } = req;
  await req.session.destroy(function () {
    console.log({ loggedUser: user });
  });
  console.log(req.session);
  return res.status(OK).json({ message: 'User Signed Out' });
};

export const get = async (req: Request, res: Response): Promise<Response | void> => {
  const { user } = req;
  return res.status(OK).json({ user });
};

export default {
  auth,
  signOut,
  get,
};
