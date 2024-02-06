import createHttpError from "http-errors";
import User from "../Models/User.model.js";
import {validateRegisterSchema, validateLoginSchema} from "../helper/validateUser.js";
import { signAccessToken } from "../helper/jwtToken.js";

const register = async (req, resp, next) => {
  try {
    const validationResult = await validateRegisterSchema.validateAsync(req.body);
    const isEmailExit = await User.findOne({ email: validationResult.email });
    if (isEmailExit)
      throw createHttpError.Conflict("Email is already registered");
    const user = await User(validationResult);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    resp.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
const login = async (req, resp, next) => {
  try {
    const validationResult = await validateLoginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: validationResult.email }).select("+password"); 
    if (!user) throw createHttpError.NotFound("User not registered");
    const isCorrectPassword = await user.comparePassword(validationResult.password);
    if(!isCorrectPassword) throw createHttpError.Unauthorized("Username/Password not valid");
    const accessToken = await signAccessToken(user.id);
    resp.json({ message: "Login Success", accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
const logout = async (req, resp, next) => {};
export { register, login, logout };
