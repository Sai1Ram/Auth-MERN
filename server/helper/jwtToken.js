import JWT from "jsonwebtoken";
import createHttpError from "http-errors";

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
export const verifyAccessToken = async (req, resp, next) => {
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
