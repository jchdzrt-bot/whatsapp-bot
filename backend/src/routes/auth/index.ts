import {
  type NextFunction,
  Router,
  type Request,
  type Response,
} from "express";
import loginUser from "../../db/methods/user/loginUser";
import createUser from "../../db/methods/user/createUser";
import getBusinessById from "../../db/methods/business/getBusinessById";
import hashPassword from "../../utils/password/hashPassword";
import { envs } from "../../index";

const authRouter = Router();

authRouter.post(
  "/login",
  async (
    req: Request<{}, {}, { email?: string; password?: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are both required",
      });
    }

    try {
      const result = await loginUser({ email, password });

      if (!result) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const secureCookies = envs.ENVIRONMENT === "production";

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: secureCookies,
        path: "/",
        maxAge: 60 * 15 * 1000, // 15 minutes, matching the access token TTL
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: secureCookies,
        path: "/",
        maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days, matching the refresh token TTL
      });

      res.status(200).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/signup",
  async (
    req: Request<
      {},
      {},
      {
        businessId?: string;
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId, email, password, firstName, lastName } = req.body;

    if (!businessId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error:
          "businessId, email, password, firstName, and lastName are all required",
      });
    }

    try {
      const business = await getBusinessById(businessId);

      if (!business) {
        return res
          .status(404)
          .json({ error: `No business found with id: ${businessId}` });
      }

      const passwordHash = await hashPassword(password);

      const user = await createUser({
        businessId,
        email,
        passwordHash,
        firstName,
        lastName,
      });

      if (!user) {
        return res.status(500).json({ error: "Failed to create the user" });
      }

      const { passwordHash: _removedHash, ...cleanUser } = user;

      res.status(201).json(cleanUser);
    } catch (error) {
      next(error);
    }
  },
);

export default authRouter;
