import { Router } from "express";
import { getDepartments, registerDepartment } from "../controllers/department.controller.js";

const router = Router();

router.route("/register").post(registerDepartment);
router.route("/get-departments").get(getDepartments)

export default router;
