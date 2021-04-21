import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection } from 'typeorm';
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
    return res.status(BAD_REQUEST);
  }
  return res.status(OK).json({ user });
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  const { user } = req.body;

  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // add validation
  await getConnection().getRepository(User).save(user);
  return res.status(CREATED).json({ user });
});

/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user && !user.id) {
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
    return res.status(BAD_REQUEST);
  }
  await repository.remove([user]);
  return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
