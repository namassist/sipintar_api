import prodiService from "../services/prodi-service.js";

const create = async (req, res, next) => {
  try {
    const result = await prodiService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const prodiId = req.params.prodiId;
    const result = await prodiService.get(prodiId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const prodiId = req.params.prodiId;
    const request = req.body;
    request.id = prodiId;

    const result = await prodiService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const prodiId = req.params.prodiId;

    await prodiService.remove(prodiId);
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
      page: req.query.page,
      size: req.query.size,
    };

    const result = await prodiService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
