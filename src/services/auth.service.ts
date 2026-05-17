import { User } from "../models/user.model";
import type { AuthUser, LoginUserInput, RegisterUserInput } from "../types/user.types";
import { ApiError } from "../utils/apiError";
import { generateToken } from "../utils/jwt";

interface AuthResult {
  user: AuthUser;
  token: string;
}

const toAuthUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: AuthUser["role"];
}): AuthUser => {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const registerUser = async (input: RegisterUserInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? "sales"
  });

  const authUser = toAuthUser(user);
  const token = generateToken({
    userId: authUser.id,
    role: authUser.role
  });

  return {
    user: authUser,
    token
  };
};

export const loginUser = async (input: LoginUserInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const authUser = toAuthUser(user);
  const token = generateToken({
    userId: authUser.id,
    role: authUser.role
  });

  return {
    user: authUser,
    token
  };
};
