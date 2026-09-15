import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  User,
  USER_ROLE,
  type UserMongoType,
} from "../../schemas/userSchema";

// passwordHash must already be a hash (e.g. produced with bcrypt/argon2) —
// this method never receives or stores a plaintext password.
export type CreateUserArgs = Omit<
  UserMongoType,
  "id" | "role" | "isActive" | "lastLoginAt" | "createdAt" | "updatedAt"
> & {
  role?: USER_ROLE;
  isActive?: boolean;
  lastLoginAt?: Date;
};

export default async function createUser({
  businessId,
  email,
  passwordHash,
  firstName,
  lastName,
  role = USER_ROLE.ADMIN,
  isActive = true,
  lastLoginAt,
}: CreateUserArgs): Promise<UserMongoType | undefined> {
  const newUser = new User({
    businessId,
    email,
    passwordHash,
    firstName,
    lastName,
    role,
    isActive,
    lastLoginAt,
  });

  try {
    await newUser.save();
    console.log(`New user created with email: ${email}`);

    const { _id, __v, ...cleanUser } = newUser.toObject();

    return cleanUser;
  } catch (error) {
    simpleErrorHandling("Error on adding a User:", error);
  }
}