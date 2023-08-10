import mataKuliahService from "../services/mataKuliah-service.js";

const create = async (req, res, next) => {
  try {
    const result = await mataKuliahService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const mataKuliahId = req.params.mataKuliahId;
    const result = await mataKuliahService.get(mataKuliahId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const mataKuliahId = req.params.mataKuliahId;
    const request = req.body;
    request.id = mataKuliahId;

    const result = await mataKuliahService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const mataKuliahId = req.params.mataKuliahId;

    await mataKuliahService.remove(mataKuliahId);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const request = {
      nama: req.query.nama,
      kode: req.query.kode,
      page: req.query.page,
      size: req.query.size,
    };

    const result = await mataKuliahService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

const groupMataKuliahDosen = async (req, res, next) => {
  try {
    const dosenId = req.params.dosenId;

    const result = await mataKuliahService.listDosen(dosenId);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const groupMataKuliahMahasiswa = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;

    const result = await mataKuliahService.listMahasiswa(mahasiswaId);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  update,
  get,
  remove,
  search,
  groupMataKuliahDosen,
  groupMataKuliahMahasiswa,
};
