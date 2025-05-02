import { Router } from "express";
import { registerDepartment } from "../controllers/department.controller.js";

const router = Router();

router.route("/register").post(registerDepartment);

export default router;
