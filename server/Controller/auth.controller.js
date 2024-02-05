import createHttpError from "http-errors";
import User from "../Models/User.model.js";
import validateUserSchema from "../helper/validateUser.js";

const register = async (req, resp, next) => {
  try {
    const validationResult = await validateUserSchema.validateAsync(req.body);
    const isEmailExit = await User.findOne({ email: validationResult.email });
    if (isEmailExit)
      throw createHttpError.Conflict("Email is already registered");
    const user = await User(validationResult);
    const savedUser = await user.save();
    resp.send(savedUser);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
const login = async (req, resp, next) => {};
const logout = async (req, resp, next) => {};
export { register, login, logout };
