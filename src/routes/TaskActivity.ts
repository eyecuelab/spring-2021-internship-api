import { Router } from "express";
import TaskActivitiesService from "../services/TaskActivity";

const router = Router();

/******************************************************************************
 *                       Add One - "POST /api/task-activities"
 ******************************************************************************/

router.post("/", TaskActivitiesService.add);

/******************************************************************************
 *                    Delete - "DELETE /api/task-activities/:id"
 ******************************************************************************/

router.delete("/:id", TaskActivitiesService.remove);

export default router;
