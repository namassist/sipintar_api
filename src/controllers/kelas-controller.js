import kelasService from "../services/kelas-service.js";

const create = async (req, res, next) => {
  try {
    const result = await kelasService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const kelasId = req.params.kelasId;
    const result = await kelasService.get(kelasId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const kelasId = req.params.kelasId;
    const request = req.body;
    request.id = kelasId;

    const result = await kelasService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const kelasId = req.params.kelasId;

    await kelasService.remove(kelasId);
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
      prodi_id: req.query.prodi_id,
      page: req.query.page,
      size: req.query.size,
    };

    const result = await kelasService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
