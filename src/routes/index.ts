import { Router } from "express";
import UserRouter from "./Users";
import ItemRouter from "./Item";
import ProjectRouter from "./Project";
import TaskRouter from "./Task";
import TaskActivityRouter from "./TaskActivity";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/items", ItemRouter);
router.use("/projects", ProjectRouter);
router.use("/tasks", TaskRouter);
router.use("/task-activities", TaskActivityRouter);

// Export the base-router
export default router;
