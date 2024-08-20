import express from 'express';
import {
    loginUser,
    registerUser,
    updateUserProfile,
    checkUser,
    deleteUser
} from '../../controllers/userControllers.js';
import { authUser } from '../../middleware/authUser.js';



const router = express.Router();


router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile/:id', authUser,updateUserProfile);
router.get('/check-user/', authUser, checkUser);
router.delete('/delete/:id', authUser, deleteUser);




 

  
export default router;
