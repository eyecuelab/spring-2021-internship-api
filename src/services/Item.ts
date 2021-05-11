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
import { Item } from "../entities/Item";
import { Project } from "../entities/Project";
import { paramMissingError } from "../shared/constants";
import logger from "../shared/Logger";

/******************************************************************************
 *                       Add One - "POST /api/items"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { item: input } = req.body;
  const project = await getConnection()
    .getRepository(Project)
    .findOne(input.project);
  if (user && project && user.uuid === project.uuid) {
    const { item: input } = req.body;
    const item = new Item();
    item.itemName = input.itemName;
    item.itemPrice = input.itemPrice;
    item.quantity = input.quantity;
    item.category = input.category;
    item.date = input.date;
    item.minutes = input.minutes;
    item.hours = input.hours;
    item.project = input.project;
    const errors = await validate(item);

    if (errors.length > 0) {
      logger.error(errors);
      res.status(BAD_REQUEST).json({ error: errors }).end();
      return;
    }

    const data = await getConnection().getRepository(Item).save(item);
    return res.status(CREATED).json({ item: data });
  } else {
    res.status(FORBIDDEN).end();
  }
};

/******************************************************************************
 *                       Update - "PUT /api/items/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { item } = req.body;
  const targetItem = await getConnection()
    .getRepository(Item)
    .findOne(item.id, { relations: ["project"] });
  if (targetItem) {
    const project = await getConnection()
      .getRepository(Project)
      .findOne(targetItem.project.id);
    if (user && project && user.uuid === project.uuid) {
      const { item } = req.body;
      if (!item && !item.id) {
        res
          .status(BAD_REQUEST)
          .json({
            error: paramMissingError,
          })
          .end();
        return;
      }
      const data = await getConnection().getRepository(Item).save(item);
      return res.status(OK).json({ item: data });
    } else {
      res.status(FORBIDDEN).end();
    }
  } else {
    res.status(NOT_FOUND).end();
  }
};

/******************************************************************************
 *                    Delete - "DELETE /api/items/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { user } = req;
  const { id } = req.params as ParamsDictionary;
  const item = await getConnection()
    .getRepository(Item)
    .findOne(id, { relations: ["project"] });
  if (!item) {
    res.status(NOT_FOUND);
    res.end();
    return;
  } else {
    const project = await getConnection()
      .getRepository(Project)
      .findOne(item.project.id);
    if (user && project && user.uuid === project.uuid) {
      await getConnection().getRepository(Item).remove([item]);
      return res.status(OK).end();
    } else {
      res.status(FORBIDDEN).end();
    }
  }
};

export default {
  add,
  update,
  remove,
};
