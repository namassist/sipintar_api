import userService from "../services/user-service.js";

const registerDsn = async (req, res, next) => {
  try {
    const result = await userService.registerDosen(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  login,
  registerDsn,
};
