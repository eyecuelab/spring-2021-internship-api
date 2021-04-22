import { Request, Response } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { paramMissingError } from '../shared/constants';
import logger from 'src/shared/Logger';

/******************************************************************************
 *                      Get All Users - "GET /api/users"
 ******************************************************************************/
export const list = async (req: Request, res: Response): Promise<Response | void> => {
  const users = await getConnection().getRepository(User).find();
  return res.status(OK).json({ users });
};

/******************************************************************************
 *                      Get User - "GET /api/users/:id"
 ******************************************************************************/

export const one = async (req: Request, res: Response): Promise<Response | void> => {
  const { id } = req.params as ParamsDictionary;
  const user = await getConnection().getRepository(User).findOne(id);
  if (!user) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }
  return res.status(OK).json({ user });
};

/******************************************************************************
 *                       Add One - "POST /api/users"
 ******************************************************************************/

export const add = async (req: Request, res: Response): Promise<Response | void> => {
  const { user: input } = req.body;
  const user = new User();
  user.firstName = input.firstName;
  user.lastName = input.lastName;
  user.email = input.email;
  user.age = input.age;
  const errors = await validate(user);

  if (errors.length > 0) {
    logger.error(errors);
    res.status(BAD_REQUEST).json({ error: errors }).end();
    return;
  }

  const data = await getConnection().getRepository(User).save(user);
  return res.status(CREATED).json({ user: data });
};

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

export const update = async (req: Request, res: Response): Promise<Response | void> => {
  const { user } = req.body;
  if (!user && !user.id) {
    res
      .status(BAD_REQUEST)
      .json({
        error: paramMissingError,
      })
      .end();
    return;
  }
  // add validation and only set provided fields
  const data = await getConnection().getRepository(User).save(user);
  return res.status(OK).json({ user: data });
};

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

export const remove = async (req: Request, res: Response): Promise<Response | void> => {
  const repository = await getConnection().getRepository(User);
  const { id } = req.params as ParamsDictionary;
  const user = await repository.findOne(id);
  if (!user) {
    res.status(BAD_REQUEST);
    res.end();
    return;
  }
  await repository.remove([user]);
  return res.status(OK).end();
};

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default {
  list,
  one,
  add,
  update,
  remove,
};
