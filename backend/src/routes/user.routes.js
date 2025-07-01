import express from "express"
import { 
    getUsers,
    verifyUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.get('/', getUsers);
router.post('/auth/google-login', verifyUser);

export default router;