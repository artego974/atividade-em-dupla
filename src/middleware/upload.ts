import multer from "multer";
import path from "path";
import fs from "fs";

// Cria a pasta de upload se não existir
const uploadDir = path.resolve(__dirname, "upload");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configura o storage para salvar com o nome original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize nome do arquivo (evita conflitos e caracteres inválidos)
    const originalName = file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, Date.now() + "-" + originalName);
  },
});

// Define tipos de arquivo permitidos
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error("Tipo de arquivo não permitido:", file.mimetype);
    cb(new Error("Tipo de arquivo não permitido"));
  }
};

// Configuração final do multer
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
