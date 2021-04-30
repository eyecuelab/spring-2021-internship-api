import { Router } from "express";
import TaskActivitiesService from "../services/TaskActivity";

const router = Router();
/******************************************************************************
 *                      Get All Users - "GET /api/task-activities"
 ******************************************************************************/

router.get("/", TaskActivitiesService.list);

/******************************************************************************
 *                      Get Item - "GET /api/task-activities/:id"
 ******************************************************************************/

router.get("/id", TaskActivitiesService.one);

/******************************************************************************
 *                       Add One - "POST /api/task-activities"
 ******************************************************************************/

router.post("/", TaskActivitiesService.add);

/******************************************************************************
 *                       Update - "PUT /api/task-activities/:id"
 ******************************************************************************/

router.put("/:id", TaskActivitiesService.update);

/******************************************************************************
 *                    Delete - "DELETE /api/task-activities/:id"
 ******************************************************************************/

router.delete("/:id", TaskActivitiesService.remove);

export default router;
