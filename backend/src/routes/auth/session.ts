import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { User } from "../../db/schemas/userSchema";
import type { AuthenticatedUserRequest } from "../../middleware/authenticatedUser";

const authSessionRouter = Router();

// The profile returns the freshly-read DB user so the frontend always gets the
// current account state (e.g. role changes, disabled accounts) instead of a
// stale JWT snapshot.
authSessionRouter.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req as AuthenticatedUserRequest).user;

      const user = await User.findOne({ id }).select("-_id -__v -passwordHash");

      if (!user) {
        return res.status(401).json({ error: "User no longer exists" });
      }

      return res.status(200).json({ data: { user } });
    } catch (error) {
      return next(error);
    }
  },
);

authSessionRouter.get(
  "/user-information",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessId } = (req as AuthenticatedUserRequest).user;

      return res
        .status(200)
        .json({ data: { businessId } });
    } catch (error) {
      return next(error);
    }
  },
);

export default authSessionRouter;