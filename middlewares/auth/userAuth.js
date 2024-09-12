import { findUserByEmail } from "../../models/userModel.js";
import { verifyAccessJWT } from "../../utility/jwtHelper.js";
import { buildErrorResponse } from "../../utility/responseHelper.js";

export const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(authorization);
    const decodedAccessJWT = verifyAccessJWT(authorization);
    if (!decodedAccessJWT) {
      throw new Error("Invalid token,UnAuthorized.");
    }
    if (decodedAccessJWT) {
      const user = await findUserByEmail(decodedAccessJWT.email);

      if (user.isVerified && user.role === "user") {
        (user.password = undefined), (req.userInfo = user);
        return next();
      }
    }
  } catch (error) {
    buildErrorResponse(res, error.message || "Invalid token,UnAuthorized.");
  }
};
