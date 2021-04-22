import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { TaskActivity } from "../entities/TaskActivity";
import { paramMissingError } from "../shared/constants";
import logger from "src/shared/Logger";

/******************************************************************************
 *                      Get All Task Activities - "GET /api/task-activities"
 ******************************************************************************/

export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const taskActivities = await getConnection()
    .getRepository(TaskActivity)
    .find();
  return res.status(OK).json({ taskActivities });
};

/******************************************************************************
 *                      Get Task Activity - "GET /api/task-activities/:id"
 ******************************************************************************/

export const one = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params as ParamsDictionary;
  const taskActivity = await getConnection()
    .getRepository(TaskActivity)
    .findOne(id);
  if (!taskActivity) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }
  return res.status(OK).json({ taskActivity });
};

/******************************************************************************
 *                       Add One - "POST /api/task-activities"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { taskActivity: input } = req.body;
  const taskActivity = new TaskActivity();
  taskActivity.dateTime = input.dateTime;
  taskActivity.description = input.description;
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
};

/******************************************************************************
 *                       Update - "PUT /api/task-activities/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { taskActivity } = req.body;
  if (!taskActivity && !taskActivity.id) {
    res
      .status(BAD_REQUEST)
      .json({
        error: paramMissingError,
      })
      .end();
    return;
  }
  // add validation and only set provided fields
  const data = await getConnection()
    .getRepository(TaskActivity)
    .save(taskActivity);
  return res.status(OK).json({ taskActivity: data });
};

/******************************************************************************
 *                    Delete - "DELETE /api/task-activities/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
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
};

export default {
  list,
  one,
  add,
  update,
  remove,
};
