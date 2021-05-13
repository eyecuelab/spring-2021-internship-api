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
// import { isLoggedIn } from "../Server";

/******************************************************************************
 *                      Get All Projects - "GET /api/projects"
 ******************************************************************************/
export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  if (user) {
    const projects = await getConnection()
      .getRepository(Project)
      .find({
        where: { uuid: user.uuid },
      });
    return res.status(OK).json({ projects });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                      Get Project - "GET /api/projects/:id"
 ******************************************************************************/

export const one = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { id } = req.params as ParamsDictionary;
  const project = await getConnection().getRepository(Project).findOne(id);
  if (!project) {
    res.status(NOT_FOUND);
    res.end();
    return;
  } else if (user && project && user.uuid === project.uuid) {
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

    return res.status(OK).json({
      currentProject: {
        projectName: project.projectName,
        startDate: project.startDate,
        endDate: project.endDate,
        id: project.id,
        hourly: project.hourly,
        units: project.units,
        markup: project.markup,
        items: {
          material: materialItems,
          labor: laborItems,
          other: otherItems,
        },
        tasks: { todo: toDoTasks, doing: doingTasks, done: doneTasks },
      },
    });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                       Add One Project - "POST /api/projects"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { project: input } = req.body;

  if (user && user.uuid === input.uuid) {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 7); // 7 days
    const project = new Project();
    project.projectName = input.projectName;
    project.hourly = 0;
    project.units = 1;
    project.markup = 0;
    project.startDate = input.startDate ?? start.toISOString();
    project.endDate = input.endDate ?? end.toISOString();
    project.uuid = input.uuid;
    const errors = await validate(project);

    if (errors.length > 0) {
      logger.error(errors);
      res.status(BAD_REQUEST).json({ error: errors }).end();
      return;
    }

    const data = await getConnection().getRepository(Project).save(project);
    return res.status(CREATED).json({ project: data });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                       Update Project - "PUT /api/projects/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { project } = req.body;
  console.log(project);
  const targetProject = await getConnection()
    .getRepository(Project)
    .findOne(project.id);
  if (targetProject && user && user.uuid === targetProject.uuid) {
    const data = await getConnection().getRepository(Project).save(project);
    return res.status(OK).json({ project: data });
  } else if (!project && !project.id) {
    res
      .status(BAD_REQUEST)
      .json({
        error: paramMissingError,
      })
      .end();
    return;
  } else if (!targetProject) {
    res.status(NOT_FOUND).end();
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                    Delete Project - "DELETE /api/projects/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { id } = req.params as ParamsDictionary;
  const targetProject = await getConnection()
    .getRepository(Project)
    .findOne(id);
  if (!targetProject) {
    res.status(NOT_FOUND);
    res.end();
    return;
  } else if (targetProject && user && user.uuid === targetProject.uuid) {
    await getConnection().getRepository(Project).remove([targetProject]);
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
  one,
  add,
  update,
  remove,
};
