import { Router } from "express";
import AuthService from "../services/Auth";

const router = Router();

/******************************************************************************
 *                       Add One - "POST /api/items"
 ******************************************************************************/

router.post("/auth/google", AuthService.auth);

router.delete("/auth/google", AuthService.signOut);

export default router;
