import { Router } from "express";
import ProjectService from "../services/Project";

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All Projects - "GET /api/projects"
 ******************************************************************************/

router.get("/", ProjectService.list);

/******************************************************************************
 *                      Get Project - "GET /api/projects/:id"
 ******************************************************************************/

router.get("/:id", ProjectService.one);

/******************************************************************************
 *                       Add One Project - "POST /api/projects"
 ******************************************************************************/

router.post("/", ProjectService.add);

/******************************************************************************
 *                       Update Project - "PUT /api/projects"
 ******************************************************************************/

router.put("/:id", ProjectService.update);

/******************************************************************************
 *                    Delete Project - "DELETE /api/projects/:id"
 ******************************************************************************/

router.delete("/:id", ProjectService.remove);

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
