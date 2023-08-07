import mahasiswaService from "../services/mahasiswa-service.js";

const create = async (req, res, next) => {
  try {
    const result = await mahasiswaService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;
    const result = await mahasiswaService.get(mahasiswaId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;
    const request = req.body;
    request.id = mahasiswaId;

    const result = await mahasiswaService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.mahasiswaId;

    await mahasiswaService.remove(mahasiswaId);
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

    const result = await mahasiswaService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
