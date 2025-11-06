import { Router } from "express";
import { EmpresaController } from "../controller/EmpresaController";
import { upload } from "../middleware/upload";

const router = Router();
const empresaController = new EmpresaController();


router.get("/empresa", empresaController.list.bind(empresaController));
router.post("/empresa", empresaController.create.bind(empresaController));
router.delete("/empresa/:id", empresaController.delete.bind(empresaController));
router.post("/empresa/login", empresaController.login.bind(empresaController));
router.post("/empresa/:empresaId/vagas", empresaController.createVaga.bind(empresaController));
router.put(
  "/empresa/upload/avatar/:id",
  upload.single("file"),
  empresaController.uploadAvatar
);

export default router;
