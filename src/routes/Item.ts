import { Router } from "express";
import ItemsService from "../services/Item";

const router = Router();
/******************************************************************************
 *                      Get All Users - "GET /api/items"
 ******************************************************************************/

router.get("/", ItemsService.list);

/******************************************************************************
 *                       Add One - "POST /api/items"
 ******************************************************************************/

router.post("/", ItemsService.add);

/******************************************************************************
 *                       Update - "PUT /api/items/:id"
 ******************************************************************************/

router.put("/:id", ItemsService.update);

/******************************************************************************
 *                    Delete - "DELETE /api/items/:id"
 ******************************************************************************/

router.delete("/:id", ItemsService.remove);

export default router;
