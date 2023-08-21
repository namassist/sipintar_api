import rekapitulasiService from "../services/rekapitulasi-service.js";

const list = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;
    const result = await rekapitulasiService.list(mahasiswaId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const listPresensiDosen = async (req, res, next) => {
  try {
    const dosenId = req.params.dosenId;
    const result = await rekapitulasiService.listPresensi(dosenId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  list,
  listPresensiDosen,
};
