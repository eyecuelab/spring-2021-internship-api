import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, FORBIDDEN } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { TaskActivity } from "../entities/TaskActivity";
import logger from "../shared/Logger";

/******************************************************************************
 *                       Add One - "POST /api/task-activities"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const { taskActivity: input } = req.body;
    const taskActivity = new TaskActivity();
    taskActivity.dateTime = input.dateTime;
    taskActivity.description = input.description;
    taskActivity.task = input.task;
    const errors = await validate(taskActivity);

    if (errors.length > 0) {
      logger.error(errors);
      res.status(BAD_REQUEST).json({ error: errors }).end();
      return;
    }

    const data = await getConnection()
      .getRepository(TaskActivity)
      .save(taskActivity);
    return res.status(CREATED).json({ taskActivity: data });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                    Delete - "DELETE /api/task-activities/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const repository = await getConnection().getRepository(TaskActivity);
    const { id } = req.params as ParamsDictionary;
    const taskActivity = await repository.findOne(id);
    if (!taskActivity) {
      res.status(BAD_REQUEST);
      res.end();
      return;
    }
    await repository.remove([taskActivity]);
    return res.status(OK).end();
  } else {
    res.status(FORBIDDEN).end();
  }
};

export default {
  add,
  remove,
};
