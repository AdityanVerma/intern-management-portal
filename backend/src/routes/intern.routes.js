import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getInternData,
    importInterns,
    onMentorAccept,
    onMentorReject,
    registerIntern,
    requestedMentorIds,
} from "../controllers/intern.controller.js";

const router = Router();

router.route("/import-intern").post(
    upload.fields([
        {
            name: "filename",
            maxCount: 1,
        },
    ]),
    importInterns
);
router.route("/register").post(registerIntern);
router.route("/interns-data").get(getInternData);
router.route("/request-mentor").post(requestedMentorIds);
router.route("/mentor-accept").post(onMentorAccept);
router.route("/mentor-reject").post(onMentorReject);

export default router;
