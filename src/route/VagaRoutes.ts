import { Router } from "express";
import { VagaController } from "../controller/VagaController";


const router = Router();
const vagaController = new VagaController();


router.get("/vagas", vagaController.list.bind(vagaController));
router.get("/vagas/:id", vagaController.show.bind(vagaController));
router.delete("/vagas/:id", vagaController.delete.bind(vagaController));
router.put("/vagas/:id", vagaController.update.bind(vagaController));
router.post(
  "/user/:userId/vagas/:vagaId/apply",
  vagaController.apply.bind(vagaController)
);



export default router;
