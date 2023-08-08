import jadwalServices from "../services/jadwal-service.js";

const create = async (req, res, next) => {
  try {
    const result = await jadwalServices.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const jadwalId = req.params.jadwalId;
    const result = await jadwalServices.get(jadwalId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const jadwalId = req.params.jadwalId;
    const request = req.body;
    request.id = jadwalId;

    const result = await jadwalServices.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const jadwalId = req.params.jadwalId;

    await jadwalServices.remove(jadwalId);
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
      kelas_id: req.query.kelas_id,
      tahun_ajaran_id: req.query.tahun_ajaran_id,
      page: req.query.page,
      size: req.query.size,
    };

    const result = await jadwalServices.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
