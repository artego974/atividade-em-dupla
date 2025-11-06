import { Router } from "express";
import { UserController } from "../controller/UserController";
import { upload } from "../middleware/upload";

const router = Router();
const userController = new UserController();

router.post("/user", userController.create);
router.get("/user", userController.list);
router.get("/user/:name", userController.show);
router.delete("/user/:id", userController.delete);
router.patch("/user/updatePassword/:id", userController.updatePassword);
router.patch("/user/updateEmail/:id", userController.updateEmail);
router.post("/user/login", userController.loginUser);
router.post("/user/logout", userController.logoutUser);
router.put(
  "/user/upload/avatar/:id",
  upload.single("file"),
  userController.uploadAvatar
);

export default router;
