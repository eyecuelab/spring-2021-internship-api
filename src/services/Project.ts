import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { Project } from "../entities/Project";
import { paramMissingError } from "../shared/constants";
import logger from "src/shared/Logger";

/******************************************************************************
 *                      Get All Projects - "GET /api/projects"
 ******************************************************************************/
export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const projects = await getConnection().getRepository(Project).find();
  return res.status(OK).json({ projects });
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
  if (!project) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }
  return res.status(OK).json({ project });
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
