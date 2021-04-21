import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { paramMissingError } from '../shared/constants';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const users = await getConnection().getRepository(User).find();
  return res.status(OK).json({ users });
});

/******************************************************************************
 *                      Get User - "GET /api/users/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params as ParamsDictionary;
  const user = await getConnection().getRepository(User).findOne(id);
  if (!user) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }
  return res.status(OK).json({ user });
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  const { user: input } = req.body;
  const user = new User();
  user.firstName = input.firstName;
  user.lastName = input.lastName;
  user.email = input.email;
  user.age = input.age;
  const valid = await validate(user);
  // TODO: check validation and return error message
  if (!user) {
    // UPDATE TO MATCH :ID
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // add validation
  const data = await getConnection().getRepository(User).save(user);
  return res.status(CREATED).json({ user: data });
});

/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user && !user.id) {
    // UPDATE TO MATCH :ID
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // add validation and only set provided fields
  const data = await getConnection().getRepository(User).save(user);
  return res.status(OK).json({ user: data });
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
  const repository = await getConnection().getRepository(User);
  const { id } = req.params as ParamsDictionary;
  const user = await repository.findOne(id);
  if (!user) {
    // UPDATE TO MATCH :ID
    return res.status(BAD_REQUEST);
  }
  await repository.remove([user]);
  return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
