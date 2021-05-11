import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  OK,
  FORBIDDEN,
  NOT_FOUND,
} from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { Task } from "../entities/Task";
import { Project } from "../entities/Project";
import { paramMissingError } from "../shared/constants";
import logger from "../shared/Logger";

/******************************************************************************
 *                       Add One Task - "POST /api/tasks"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { task: input } = req.body;
  const project = await getConnection()
    .getRepository(Project)
    .findOne(input.project);
  if (user && project && user.uuid === project.uuid) {
    const taskList = await getConnection().getRepository(Task).find();
    const position: number = taskList.length + 1;
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
  const { task } = req.body;
  const targetTask = await getConnection()
    .getRepository(Task)
    .findOne(task.id, { relations: ["project"] });
  if (targetTask) {
    const project = await getConnection()
      .getRepository(Project)
      .findOne(targetTask.project.id);
    if (user && project && user.uuid === project.uuid) {
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
  } else {
    res.status(NOT_FOUND).end();
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
  const { id } = req.params as ParamsDictionary;
  const task = await getConnection()
    .getRepository(Task)
    .findOne(id, { relations: ["project"] });
  if (!task) {
    res.status(NOT_FOUND);
    res.end();
    return;
  } else {
    const project = await getConnection()
      .getRepository(Project)
      .findOne(task.project.id);
    if (user && project && user.uuid === project.uuid) {
      await getConnection().getRepository(Task).remove([task]);
      return res.status(OK).end();
    } else {
      res.status(FORBIDDEN).end();
    }
  }
};

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default {
  add,
  update,
  remove,
};
