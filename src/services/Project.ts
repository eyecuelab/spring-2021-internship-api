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
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { Item } from "../entities/Item";
import { paramMissingError } from "../shared/constants";
import logger from "../shared/Logger";

/******************************************************************************
 *                      Get All Projects - "GET /api/projects"
 ******************************************************************************/
export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  console.log(user);
  if (user === undefined) {
    return res.status(FORBIDDEN).end();
  } else {
    const projects = await getConnection()
      .getRepository(Project)
      .find({
        where: { uuid: user.uuid },
      });

    console.log(user);
    return res.status(OK).json({ projects });
  }
};

/******************************************************************************
 *                      Get Project - "GET /api/projects/:id"
 ******************************************************************************/

export const one = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params as ParamsDictionary;
  const project = await getConnection().getRepository(Project).findOne(id);
  const toDoTasks = await getConnection()
    .getRepository(Task)
    .find({
      where: { project: { id }, taskStatus: "todo" },
      order: { position: "ASC" },
    });
  const doingTasks = await getConnection()
    .getRepository(Task)
    .find({
      where: { project: { id }, taskStatus: "doing" },
      order: { position: "ASC" },
    });
  const doneTasks = await getConnection()
    .getRepository(Task)
    .find({
      where: { project: { id }, taskStatus: "done" },
      order: { position: "ASC" },
    });
  const materialItems = await getConnection()
    .getRepository(Item)
    .find({ where: { project: { id }, category: "material" } });
  const laborItems = await getConnection()
    .getRepository(Item)
    .find({ where: { project: { id }, category: "labor" } });
  const otherItems = await getConnection()
    .getRepository(Item)
    .find({ where: { project: { id }, category: "other" } });
  if (!project) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }

  return res.status(OK).json({
    currentProject: {
      projectName: project.projectName,
      startDate: project.startDate,
      endDate: project.endDate,
      id: project.id,
      items: { material: materialItems, labor: laborItems, other: otherItems },
      tasks: { todo: toDoTasks, doing: doingTasks, done: doneTasks },
    },
  });
};

/******************************************************************************
 *                       Add One Project - "POST /api/projects"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { project: input } = req.body;
  const project = new Project();
  project.projectName = input.projectName;
  project.startDate = input.startDate;
  project.endDate = input.endDate;
  const errors = await validate(project);

  if (errors.length > 0) {
    logger.error(errors);
    res.status(BAD_REQUEST).json({ error: errors }).end();
    return;
  }

  const data = await getConnection().getRepository(Project).save(project);
  return res.status(CREATED).json({ project: data });
};

/******************************************************************************
 *                       Update Project - "PUT /api/projects/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { project } = req.body;
  if (!project && !project.id) {
    res
      .status(BAD_REQUEST)
      .json({
        error: paramMissingError,
      })
      .end();
    return;
  }
  // add validation and only set provided fields
  const data = await getConnection().getRepository(Project).save(project);
  return res.status(OK).json({ project: data });
};

/******************************************************************************
 *                    Delete Project - "DELETE /api/projects/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const repository = await getConnection().getRepository(Project);
  const { id } = req.params as ParamsDictionary;
  const project = await repository.findOne(id);
  if (!project) {
    res.status(BAD_REQUEST);
    res.end();
    return;
  }
  await repository.remove([project]);
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
