import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND,
  FORBIDDEN,
} from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { Task } from "../entities/Task";
import { paramMissingError } from "../shared/constants";
import logger from "../shared/Logger";

/******************************************************************************
 *                      Get All Tasks - "GET /api/tasks"
 ******************************************************************************/
export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const tasks = await getConnection().getRepository(Task).find();
    return res.status(OK).json({ tasks });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                       Add One Task - "POST /api/tasks"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const taskList = await getConnection().getRepository(Task).find();
    const position: number = taskList.length + 1;
    const { task: input } = req.body;
    const task = new Task();
    task.taskName = input.taskName;
    task.taskDesc = input.taskDesc;
    task.taskStatus = input.taskStatus;
    task.project = input.project;
    task.position = position * 100;
    task.activity = input.activity;
    const errors = await validate(task);

    if (errors.length > 0) {
      logger.error(errors);
      res.status(BAD_REQUEST).json({ error: errors }).end();
      return;
    }

    const data = await getConnection().getRepository(Task).save(task);
    return res.status(CREATED).json({ task: data });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                       Update Task - "PUT /api/tasks/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const { task } = req.body;
    if (!task && !task.id) {
      res
        .status(BAD_REQUEST)
        .json({
          error: paramMissingError,
        })
        .end();
      return;
    }
    // add validation and only set provided fields
    const data = await getConnection().getRepository(Task).save(task);
    return res.status(OK).json({ task: data });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                    Delete Task - "DELETE /api/tasks/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const repository = await getConnection().getRepository(Task);
    const { id } = req.params as ParamsDictionary;
    const task = await repository.findOne(id);
    if (!task) {
      res.status(BAD_REQUEST);
      res.end();
      return;
    }
    await repository.remove([task]);
    return res.status(OK).end();
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default {
  list,
  add,
  update,
  remove,
};
