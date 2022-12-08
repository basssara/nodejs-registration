import { Router } from "express";
import connection from "../utils/mysql";
import { getUsers, SignIn, SignUp } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/users", authMiddleware, getUsers);
router.post("/signup", SignUp);
router.post("/signin", SignIn);

export default router;
