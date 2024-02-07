import createHttpError from "http-errors";
import User from "../Models/User.model.js";
import {
  validateRegisterSchema,
  validateLoginSchema,
} from "../helper/validateUser.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helper/jwtToken.js";
// import client from "../Config/redis.config.js";

const register = async (req, resp, next) => {
  try {
    const validationResult = await validateRegisterSchema.validateAsync(
      req.body
    );
    const isEmailExit = await User.findOne({ email: validationResult.email });
    if (isEmailExit)
      throw createHttpError.Conflict("Email is already registered");
    const user = await User(validationResult);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(user.id);
    resp.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
const login = async (req, resp, next) => {
  try {
    const validationResult = await validateLoginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: validationResult.email }).select(
      "+password"
    );
    if (!user) throw createHttpError.NotFound("User not registered");
    const isCorrectPassword = await user.comparePassword(
      validationResult.password
    );
    if (!isCorrectPassword)
      throw createHttpError.Unauthorized("Username/Password not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    const usernew = await User.updateOne(
      { _id: user._id },
      { refreshToken: refreshToken }
    );
    console.log(usernew)
    resp.json({ message: "Login Success", accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
const refreshToken = async (req, resp, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = await verifyRefreshToken(refreshToken);
    const user = await User.findOne({ _id: userId });
    if(user.refreshToken === refreshToken){
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      await User.updateOne({ _id: userId }, { refreshToken: refToken });
      resp.send({ accessToken, refreshToken: refToken });
    }else{
      throw createHttpError.Unauthorized();
      
    }
  } catch (error) {
    next(error);
  }
};
const logout = async (req, resp, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = await verifyRefreshToken(refreshToken);
    const user = await User.findOne({ _id: userId });
    if(user.refreshToken === refreshToken){
    await User.updateOne({ _id: userId }, { refreshToken: "" });
    resp.send({ message:"Logout" });
    }
    else{
      throw createHttpError.Unauthorized();
    }
    // client.DEL(userId, (err, val) => {
    //   if (err) {
    //     console.log(err.message)
    //     throw createError.InternalServerError()
    //   }
    //   console.log(val)
    //   resp.sendStatus(204)
    // })
  } catch (error) {
    next(error);
  }
};
export { register, login, logout, refreshToken };
