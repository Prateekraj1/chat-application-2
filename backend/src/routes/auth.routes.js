import express from 'express';
import { login, logout, signup , updateProfile , checkAuth , fetchUsers} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/signup' , signup);

router.post('/login' , login);

router.post('/logout' , logout);

router.get('/fetchUsers' , protectRoute , fetchUsers)

router.put('/updateProfile' , protectRoute, updateProfile);

//a check route to know where to navigate when refreshed or so
router.get('/check' , protectRoute , checkAuth)

export default router;