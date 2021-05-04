import { Router } from 'express';
import AuthService from '../services/Auth';

const router = Router();

/******************************************************************************
 *                       Add One - "POST /api/items"
 ******************************************************************************/

router.post('/', AuthService.auth);

router.delete('/', AuthService.signOut);

router.get('/me', AuthService.get);

export default router;
