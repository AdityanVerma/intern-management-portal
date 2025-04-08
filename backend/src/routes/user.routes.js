import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = Router();

// To get user information
router.route("/me").get(verifyJWT, (req, res) => {
    res.json({
        user: req.user,
        message: `Logged in as ${req.user.role}`,
    });
});

// login route only "hr" can access
router.route("/hr").get(verifyJWT, authorizeRole("hr"), (_, res) => {
    res.json({ message: "Welcome HR!!" });
});

// login route only "mentor" can access
router.route("/mentor").get(verifyJWT, authorizeRole("mentor"), (_, res) => {
    res.json({ message: "Welcome Mentor!!" });
});

export default router;
