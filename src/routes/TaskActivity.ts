import { Router } from "express";
import TaskActivitiesService from "../services/TaskActivity";

const router = Router();
/******************************************************************************
 *                      Get All Users - "GET /api/task-activities"
 ******************************************************************************/

router.get("/", TaskActivitiesService.list);

/******************************************************************************
 *                       Add One - "POST /api/task-activities"
 ******************************************************************************/

router.post("/", TaskActivitiesService.add);

/******************************************************************************
 *                    Delete - "DELETE /api/task-activities/:id"
 ******************************************************************************/

router.delete("/:id", TaskActivitiesService.remove);

export default router;
