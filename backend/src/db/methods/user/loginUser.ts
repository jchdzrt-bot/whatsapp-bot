import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import verifyPassword from "../../../utils/password/verifyPassword";
import {
  signAccessToken,
  signRefreshToken,
} from "../../../utils/jwt/signToken";
import {
  User,
  type UserMongoType,
} from "../../schemas/userSchema";

export type LoginUserArgs = {
  email: string;
  password: string; // plaintext input from the frontend login form
};

export type LoginUserResult = {
  accessToken: string;
  refreshToken: string;
  user: Omit<UserMongoType, "passwordHash">;
};

export default async function loginUser({
  email,
  password,
}: LoginUserArgs): Promise<LoginUserResult | NullOrUndefined> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // passwordHash is excluded by default (select: false), so pull it in
    // explicitly just for the credential check.
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash",
    );

    // Same null response for unknown email, wrong password, or inactive
    // account, so callers can't tell which one failed.
    if (!user) return null;
    if (!(await verifyPassword(password, user.passwordHash))) return null;
    if (!user.isActive) return null;

    const updatedUser = await User.findOneAndUpdate(
      { id: user.id },
      { $set: { lastLoginAt: new Date() } },
      // Keep the hash out of the returned document.
      { new: true, select: "-_id -__v -passwordHash" },
    );

    if (!updatedUser) return null;

    const { passwordHash, ...cleanUser } = updatedUser.toObject();

    // Sign a short-lived access token plus a long-lived refresh token. The
    // "type" claim keeps each token scoped to its purpose (see
    // utils/jwt/signToken.ts).
    const { id, businessId, role } = cleanUser;

    return {
      accessToken: signAccessToken({ id, businessId, role }),
      refreshToken: signRefreshToken({ id, businessId, role }),
      user: cleanUser,
    };
  } catch (error) {
    simpleErrorHandling("Error logging in user:", error);
  }
}