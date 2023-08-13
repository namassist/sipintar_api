import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import userController from "../controllers/user-controllers.js";
import adminController from "../controllers/admin-controller.js";
import dosenController from "../controllers/dosen-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import jurusanController from "../controllers/jurusan-controller.js";
import prodiController from "../controllers/prodi-controller.js";
import tahunAjaranController from "../controllers/tahunAjaran-controller.js";
import kelasController from "../controllers/kelas-controller.js";
import mataKuliahController from "../controllers/mataKuliah-controller.js";
import jadwalController from "../controllers/jadwal-controller.js";
import jadwalPertemuanController from "../controllers/jadwalPertemuan-controller.js";
import presensiController from "../controllers/presensi-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get("/api/users/current", userController.get);
userRouter.delete("/api/users/logout", userController.logout);

// Admin API
userRouter.get("/api/admin", adminController.search);
userRouter.post("/api/admin", adminController.create);
userRouter.get("/api/admin/:adminId", adminController.get);
userRouter.put("/api/admin/:adminId", adminController.update);
userRouter.delete("/api/admin/:adminId", adminController.remove);

// Mahasiswa API
userRouter.get("/api/mahasiswa", mahasiswaController.search);
userRouter.post("/api/mahasiswa", mahasiswaController.create);
userRouter.get("/api/mahasiswa/:mahasiswaId", mahasiswaController.get);
userRouter.put("/api/mahasiswa/:mahasiswaId", mahasiswaController.update);
userRouter.delete("/api/mahasiswa/:mahasiswaId", mahasiswaController.remove);
userRouter.get(
  "/api/mahasiswa/:mahasiswaId/mataKuliah",
  mataKuliahController.groupMataKuliahMahasiswa
);
userRouter.get(
  "/api/mahasiswa/:mahasiswaId/jadwal",
  jadwalController.mahasiswaJadwal
);
userRouter.get(
  "/api/mahasiswa/:mahasiswaId/listPertemuan/:listPertemuanId",
  jadwalPertemuanController.jadwalPertemuanMahasiswa
);

// Dosen API
userRouter.get("/api/dosen", dosenController.search);
userRouter.post("/api/dosen", dosenController.create);
userRouter.get("/api/dosen/:dosenId", dosenController.get);
userRouter.put("/api/dosen/:dosenId", dosenController.update);
userRouter.delete("/api/dosen/:dosenId", dosenController.remove);
userRouter.get("/api/dosen/:dosenId/jadwal", jadwalController.dosenJadwal);
userRouter.get(
  "/api/dosen/:dosenId/mataKuliah",
  mataKuliahController.groupMataKuliahDosen
);

// Jurusan API
userRouter.get("/api/jurusan", jurusanController.search);
userRouter.post("/api/jurusan", jurusanController.create);
userRouter.get("/api/jurusan/:jurusanId", jurusanController.get);
userRouter.put("/api/jurusan/:jurusanId", jurusanController.update);
userRouter.delete("/api/jurusan/:jurusanId", jurusanController.remove);

// Program Studi API
userRouter.get("/api/prodi", prodiController.search);
userRouter.post("/api/prodi", prodiController.create);
userRouter.get("/api/prodi/:prodiId", prodiController.get);
userRouter.put("/api/prodi/:prodiId", prodiController.update);
userRouter.delete("/api/prodi/:prodiId", prodiController.remove);

// Tahun Ajaran API
userRouter.get("/api/tahunAjaran", tahunAjaranController.search);
userRouter.post("/api/tahunAjaran", tahunAjaranController.create);
userRouter.get("/api/tahunAjaran/:tahunAjaranId", tahunAjaranController.get);
userRouter.put("/api/tahunAjaran/:tahunAjaranId", tahunAjaranController.update);
userRouter.delete(
  "/api/tahunAjaran/:tahunAjaranId",
  tahunAjaranController.remove
);

// Kelas API
userRouter.get("/api/kelas", kelasController.search);
userRouter.post("/api/kelas", kelasController.create);
userRouter.get("/api/kelas/:kelasId", kelasController.get);
userRouter.put("/api/kelas/:kelasId", kelasController.update);
userRouter.delete("/api/kelas/:kelasId", kelasController.remove);

// Mata Kuliah API
userRouter.get("/api/mataKuliah", mataKuliahController.search);
userRouter.post("/api/mataKuliah", mataKuliahController.create);
userRouter.get("/api/mataKuliah/:mataKuliahId", mataKuliahController.get);
userRouter.put("/api/mataKuliah/:mataKuliahId", mataKuliahController.update);
userRouter.delete("/api/mataKuliah/:mataKuliahId", mataKuliahController.remove);
userRouter.get(
  "/api/mataKuliah/:mataKuliahId/kelas/:kelasId/dosen/:dosenId",
  jadwalPertemuanController.search
);

// Jadwal API
userRouter.get("/api/jadwal", jadwalController.search);
userRouter.post("/api/jadwal", jadwalController.create);
userRouter.get("/api/jadwal/:jadwalId", jadwalController.get);
userRouter.put("/api/jadwal/:jadwalId", jadwalController.update);
userRouter.delete("/api/jadwal/:jadwalId", jadwalController.remove);

// Aktivasi Perkuliahan API
userRouter.post("/api/aktivasiPerkuliahan", jadwalPertemuanController.create);
userRouter.get(
  "/api/aktivasiPerkuliahan/:aktivasiId",
  jadwalPertemuanController.get
);

// Presensi Mahasiswa
userRouter.post("/api/presensi", presensiController.create);

export { userRouter };
