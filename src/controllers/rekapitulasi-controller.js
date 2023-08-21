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

const listPresensiMahasiswa = async (req, res, next) => {
  try {
    const request = {
      kelas_id: req.query.kelas_id,
      page: req.query.page,
      size: req.query.size,
    };
    const dosenId = req.params.dosenId;
    const result = await rekapitulasiService.listPresensiMahasiswa(
      request,
      dosenId
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const listPresensiMengajar = async (req, res, next) => {
  try {
    const request = {
      bulan: req.query.bulan,
      page: req.query.page,
      size: req.query.size,
    };
    const dosenId = req.params.dosenId;
    const result = await rekapitulasiService.listRekapitulasiMengajar(
      request,
      dosenId
    );
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
  listPresensiMahasiswa,
  listPresensiMengajar,
};
