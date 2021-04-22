import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { getConnection } from "typeorm";
import { validate } from "class-validator";
import { Item } from "../entities/Item";
import { paramMissingError } from "../shared/constants";
import logger from "src/shared/Logger";

/******************************************************************************
 *                      Get All Items - "GET /api/items"
 ******************************************************************************/

export const list = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const items = await getConnection().getRepository(Item).find();
  return res.status(OK).json({ items });
};

/******************************************************************************
 *                      Get Item - "GET /api/items/:id"
 ******************************************************************************/

export const one = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params as ParamsDictionary;
  const item = await getConnection().getRepository(Item).findOne(id);
  if (!item) {
    res.status(NOT_FOUND);
    res.end();
    return;
  }
  return res.status(OK).json({ item });
};

/******************************************************************************
 *                       Add One - "POST /api/items"
 ******************************************************************************/

export const add = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
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
};

/******************************************************************************
 *                       Update - "PUT /api/items/:id"
 ******************************************************************************/

export const update = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
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
  // add validation and only set provided fields
  const data = await getConnection().getRepository(Item).save(item);
  return res.status(OK).json({ item: data });
};

/******************************************************************************
 *                    Delete - "DELETE /api/items/:id"
 ******************************************************************************/

export const remove = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const repository = await getConnection().getRepository(Item);
  const { id } = req.params as ParamsDictionary;
  const item = await repository.findOne(id);
  if (!item) {
    res.status(BAD_REQUEST);
    res.end();
    return;
  }
  await repository.remove([item]);
  return res.status(OK).end();
};

export default {
  list,
  one,
  add,
  update,
  remove,
};
