import rekapitulasiMahasiswa from "../services/rekapitulasi-service.js";

const list = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;
    const result = await rekapitulasiMahasiswa.list(mahasiswaId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  list,
};
