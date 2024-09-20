import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createNewUser,
  findUserByEmail,
  updateUser,
} from "../models/userModel.js";
import { newUserValidation } from "../middlewares/joiValidation/userValidation.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import {
  createSession,
  deletePreviousAccessTokens,
  findUserByToken,
} from "../models/sessionModel.js";
import {
  sendAccountVerifiedEmail,
  sendResetPassword,
  sendVerificationLinkEmail,
} from "../utility/nodemailerHelper.js";
import { generateJWTs } from "../utility/jwtHelper.js";
import { userAuth } from "../middlewares/auth/userAuth.js";

export const userRouter = express.Router();

// create new user and send email verification.
userRouter.post("/", newUserValidation, async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    const findUser = await findUserByEmail(email);
    if (findUser) {
      return buildErrorResponse(res, "User with this e-mail already exists.");
    }

    const hashedPassword = hashPassword(password);
    const newUser = await createNewUser({
      ...req.body,
      password: hashedPassword,
    });

    if (newUser._id) {
      // creating session token for the user to verify
      const secureID = uuidv4();
      const newUserSession = await createSession({
        email: newUser.email,
        token: secureID,
      });

      //sending verification link to the user
      if (newUserSession._id) {
        const verificationUrl = `${process.env.CLIENT_ROOT_URL}/user/verify-useremail?e=${newUser.email}&id=${secureID}`;
        // sending email with the help of nodemailer
        sendVerificationLinkEmail(newUser, verificationUrl);
      }
    }

    newUser._id
      ? buildSuccessResponse(
          res,
          {},
          "Please check your email inbox/spam to verify your account."
        )
      : buildErrorResponse(
          res,
          "Could not create user.Please contact administrator."
        );
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User with this e-mail already exists.";
    }
    console.log(error);
  }
});

// verify user email
userRouter.post("/verify-email", async (req, res) => {
  try {
    const { userEmail, sessionToken } = req.body;
    const findSessionToken = findUserByToken(sessionToken);
    const userEmailFound = findUserByEmail(userEmail);

    const [foundUser, foundToken] = await Promise.all([
      userEmailFound,
      findSessionToken,
    ]);

    if (foundUser && foundToken) {
      const deleteVerifyingSessionToken = await deletePreviousAccessTokens(
        userEmail
      );

      const updateUserVerification = await updateUser(userEmail, {
        isVerified: true,
      });

      if (updateUserVerification) {
        const { firstName, lastName, email } = updateUserVerification;
        // send account verification email
        sendAccountVerifiedEmail(
          { firstName, lastName, email },
          process.env.CLIENT_ROOT_URL
        );
        buildSuccessResponse(res, {}, "Your email is verified.");
        return;
      }
      return;
    }
    buildErrorResponse(
      res,
      "Account can not be verified. Please contact admin. "
    );
  } catch (error) {
    console.log(error);
    buildErrorResponse(
      res,
      "Account can not be verified. Please contact admin. "
    );
  }
});

// send password reset email
userRouter.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    // check if the user is on the system
    const user = await findUserByEmail(email);

    if (!user) {
      return buildErrorResponse(res, "User doesn't exists. Please SignUp.");
    }

    if (user) {
      // if user is created send a verification email
      const secureID = uuidv4();
      //   store this secure ID in session storage for that user
      const newUserSession = await createSession({
        email: user.email,
        token: secureID,
      });
      if (newUserSession?._id) {
        // create verification link and send verification email
        const verificationUrl = `${process.env.CLIENT_ROOT_URL}/reset-password/newpassword?e=${user.email}&id=${secureID}`;
        // send the email
        sendResetPassword(user, verificationUrl);
      }
      return buildSuccessResponse(
        res,
        user.email,
        " Please check your email for password reset link."
      );
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// newPassword Update
userRouter.post("/reset-password/newpassword", async (req, res) => {
  try {
    const { password, token, userEmail } = req.body;

    // find user
    const user = await findUserByEmail(userEmail);
    const tokenCheck = await findUserByToken(token);

    if (!tokenCheck) {
      buildErrorResponse(
        res,
        "Unauthorised. Please request new email link to perform this action. "
      );
    }

    if (user?.password) {
      const checkPassword = comparePassword(password, user.password);
      if (checkPassword) {
        return buildErrorResponse(
          res,
          "This password was previously used. Please enter a new one."
        );
      }
    }

    if (user?._id && tokenCheck?._id) {
      const deleteVerifyingToken = await deletePreviousAccessTokens(userEmail);

      const hashedPassword = hashPassword(password);
      const updatePassword = await updateUser(userEmail, {
        password: hashedPassword,
      });
      if (!updatePassword) {
        return buildErrorResponse(
          res,
          "Couldn't perform action. Please try again."
        );
      }
      buildSuccessResponse(res, {}, "Password Changed Successfully.");
    }
  } catch (error) {
    console.log(error);
    buildErrorResponse(res, error.message);
  }
});

// login user
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    const passwordMatch = comparePassword(password, user.password);
    if (!user) {
      return buildErrorResponse(res, "User does not exists. Please SignUp.");
    }

    if (!passwordMatch) {
      return buildErrorResponse(res, "Invalid Credentials.");
    }

    if (!user.isVerified) {
      return buildErrorResponse(
        res,
        "Please verify your account. And try again."
      );
    }
    if (passwordMatch && user.role === "user" && user.isVerified) {
      const jwts = await generateJWTs(user.email);
      return buildSuccessResponse(res, jwts, "Logged in Successfully.");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// get user
userRouter.get("/", userAuth, async (req, res) => {
  try {
    buildSuccessResponse(res, req.userInfo, "user Info");
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});

// chnage user details
userRouter.post("/update-details/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateUserDetails = await updateUser(req.body.email, req.body);

    if (updateUserDetails) {
      const { password, role, ...rest } = updateUserDetails;
      return buildSuccessResponse(res, rest, "Details Updated.");
    }
  } catch (error) {
    console.log("router error", error.message);
    buildErrorResponse(res, error.message);
  }
});

// change userPassword from change password user page endpoint
userRouter.post("/update-password/:id", userAuth, async (req, res) => {
  console.log(req.body);
});
