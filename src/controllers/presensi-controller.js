import presensiMahasiswa from "../services/presensi-service.js";

const create = async (req, res, next) => {
  try {
    const result = await presensiMahasiswa.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const aktivasiId = req.params.aktivasiId;
    const result = await presensiMahasiswa.get(aktivasiId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  get,
};
