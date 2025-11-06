import express, { Application, Request, Response } from "express";
import { AppDataSource } from "./config/data-source";
import UserRoutes from "./route/UserRoutes";
import EmpresaRoutes from "./route/EmpresaRoutes"
import VagaRoutes from "./route/VagaRoutes"
import cors from "cors";
import path from "path";
import multer from "multer";

const upload = multer({ dest: "middlewares/upload/" });

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5500",
    ],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

AppDataSource.initialize()
  .then(() => {
    app.use(VagaRoutes)
    app.use(EmpresaRoutes)
    app.use(UserRoutes);
    app.listen(3000, () => console.log("Server rodando na porta 3000"));
  })
  .catch((error) => console.log(error));
