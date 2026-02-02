import express from "express";
import { register,login} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { protectRoute } from "../middleware/role.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;