import adminService from "../services/admin-service.js";

const create = async (req, res, next) => {
  try {
    const result = await adminService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    const result = await adminService.get(adminId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    const request = req.body;
    request.id = adminId;

    const result = await adminService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;

    await adminService.remove(adminId);
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

    const result = await adminService.search(request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, update, get, remove, search };
