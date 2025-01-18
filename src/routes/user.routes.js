import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { adminLogin, adminLogout, userData, userInput } from "../controllers/user.controller.js";
import protectAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/users").post(
    upload.array("images"),
    userInput
);

router.route("/admin/login").post(adminLogin);

router.route("/users").get(protectAdmin,userData);

router.route("/admin/logout").post(adminLogout);

export default router