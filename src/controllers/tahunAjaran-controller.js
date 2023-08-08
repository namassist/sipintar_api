import tahunAjaranService from "../services/tahunAjaran-service.js";

const create = async (req, res, next) => {
  try {
    const result = await tahunAjaranService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const tahunAjaranId = req.params.tahunAjaranId;
    const result = await tahunAjaranService.get(tahunAjaranId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const tahunAjaranId = req.params.tahunAjaranId;
    const request = req.body;
    request.id = tahunAjaranId;

    const result = await tahunAjaranService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const tahunAjaranId = req.params.tahunAjaranId;

    await tahunAjaranService.remove(tahunAjaranId);
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

    const result = await tahunAjaranService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
