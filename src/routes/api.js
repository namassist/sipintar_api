import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import prodiController from "../controllers/prodi-controller.js";
import jurusanController from "../controllers/jurusan-controller.js";
import dosenController from "../controllers/dosen-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";

const userRouter = new express.Router();
// userRouter.use(authMiddleware);

// Mahasiswa API
userRouter.get("/api/mahasiswa", mahasiswaController.search);
userRouter.post("/api/mahasiswa", mahasiswaController.create);
userRouter.get("/api/mahasiswa/:mahasiswaId", mahasiswaController.get);
userRouter.put("/api/mahasiswa/:mahasiswaId", mahasiswaController.update);
userRouter.delete("/api/mahasiswa/:mahasiswaId", mahasiswaController.remove);

// Dosen API
userRouter.get("/api/dosen", dosenController.search);
userRouter.post("/api/dosen", dosenController.create);
userRouter.get("/api/dosen/:dosenId", dosenController.get);
userRouter.put("/api/dosen/:dosenId", dosenController.update);
userRouter.delete("/api/dosen/:dosenId", dosenController.remove);

// Jurusan API
userRouter.get("/api/jurusan", jurusanController.search);
userRouter.post("/api/jurusan", jurusanController.create);
userRouter.get("/api/jurusan/:jurusanId", jurusanController.get);
userRouter.put("/api/jurusan/:jurusanId", jurusanController.update);
userRouter.delete("/api/jurusan/:jurusanId", jurusanController.remove);

// Jurusan API
userRouter.get("/api/prodi", prodiController.search);
userRouter.post("/api/prodi", prodiController.create);
userRouter.get("/api/prodi/:prodiId", prodiController.get);
userRouter.put("/api/prodi/:prodiId", prodiController.update);
userRouter.delete("/api/prodi/:prodiId", prodiController.remove);

export { userRouter };
