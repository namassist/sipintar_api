import jadwalPertemuan from "../services/jadwalPertemuan-service.js";

const create = async (req, res, next) => {
  try {
    const result = await jadwalPertemuan.create(req.body);
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
    const result = await jadwalPertemuan.get(aktivasiId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const jadwalPertemuanMahasiswa = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;
    const listPertemuanId = req.params.listPertemuanId;
    const result = await jadwalPertemuan.jadwalPertemuanMahasiswa(
      mahasiswaId,
      listPertemuanId
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const jadwalPertemuan = req.params.jadwalPertemuan;
    const request = req.body;
    request.id = jadwalPertemuan;

    const result = await jadwalPertemuan.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const jadwalPertemuan = req.params.jadwalPertemuan;

    await jadwalPertemuan.remove(jadwalPertemuan);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const mataKuliahId = req.params.mataKuliahId;
    const kelasId = req.params.kelasId;
    const dosenId = req.params.dosenId;

    const result = await jadwalPertemuan.search(mataKuliahId, kelasId, dosenId);
    res.status(200).json({
      data: result.data,
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
  jadwalPertemuanMahasiswa,
};
