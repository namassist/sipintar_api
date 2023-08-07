import dosenService from "../services/dosen-service.js";

const create = async (req, res, next) => {
  try {
    const result = await dosenService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const dosenId = req.params.dosenId;
    const result = await dosenService.get(dosenId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const dosenId = req.params.dosenId;
    const request = req.body;
    request.id = dosenId;

    const result = await dosenService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const dosenId = req.params.dosenId;

    await dosenService.remove(dosenId);
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

    const result = await dosenService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
