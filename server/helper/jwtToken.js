import JWT from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../Models/User.model.js";
// import client from '../Config/redis.config.js'

// ACCESS TOKEN GENERATION
export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secrete = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
      audience: userId,
    };
    JWT.sign(payload, secrete, options, (err, token) => {
      if (err) {
        console.log(err);
        return reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

// REFRESS TOKEN GENERATION
export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: "1yr",
      audience: userId,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message);
        return reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });

    // client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
    //   if (err) {
    //     console.log(err.message)
    //     reject(createError.InternalServerError())
    //     return
    //   }
    //   resolve(token)
    // })
    // resolve(token)
  });
};

// VERIFICATION OF THE ACCESS TOKEN
export const verifyAccessToken = (req, resp, next) => {
  if (!req.headers.authorization) return next(createHttpError.Unauthorized());
  const token = req.headers.authorization.split(" ")[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createHttpError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return reject(createHttpError.Unauthorized());
        const userId = payload.aud;

        // console.log(user)
        // client.GET(userId, (err, result) => {
        //   if (err) {
        //     console.log(err.message)
        //     reject(createError.InternalServerError())
        //     return
        //   }
        //   if (refreshToken === result) return resolve(userId)
        //   reject(createError.Unauthorized())
        // })
        resolve(userId);
      }
    );
  });
};
