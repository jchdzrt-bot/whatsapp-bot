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

// Validates the user's credentials and hands back an access + refresh token
// pair. Public endpoint: it's the entry point for frontend users, so it must
// NOT sit behind the x-api-key service middleware.
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
      // Returns null for unknown email, wrong password, or inactive account.
      const result = await loginUser({ email, password });

      if (!result) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Deliver the token pair as httpOnly cookies instead of exposing them
      // in the JSON body: the browser stores them and the server reads them
      // back from req.cookies on later requests. Attributes mirror the JWT
      // expiries in utils/jwt/signToken.ts (access = 15 min, refresh = 30
      // days); secure only over HTTPS (production).
      const secureCookies = envs.ENVIROMENT === "production";

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

      // Only the profile data goes in the body now; the tokens live in the
      // cookies above.
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
      // Users must belong to an existing business, so fail early on an
      // unknown businessId instead of creating an orphan account.
      const business = await getBusinessById(businessId);

      if (!business) {
        return res
          .status(404)
          .json({ error: `No business found with id: ${businessId}` });
      }

      // Hash the plaintext password (SALT_ROUNDS from envs) — the DB only
      // ever stores the hash.
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

      // Keep the hash out of the response; created users can go log in.
      const { passwordHash: _removedHash, ...cleanUser } = user;

      res.status(201).json(cleanUser);
    } catch (error) {
      // Duplicate email surfaces here (unique index) → 409 via the
      // routeErrorHandler's duplicate-key handling.
      next(error);
    }
  },
);

export default authRouter;
