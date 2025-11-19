import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { CustomError, ErrorCodes, ErrorKeys } from "../common/errors";

const userRepository = AppDataSource.getRepository(User);

export async function register(email: string, password: string, firstName?: string, lastName?: string) {
  // Check if user already exists
  const existingUser = await userRepository.findOne({ where: { email } });

  if (existingUser) {
    throw new CustomError(ErrorCodes.CONFLICT, ErrorKeys.USER_ALREADY_EXISTS, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = userRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    isVerified: false,
  });

  await userRepository.save(user);
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function login(email: string, password: string) {
  // Find user
  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new CustomError(ErrorCodes.UNAUTHORIZED, ErrorKeys.INVALID_CREDENTIALS, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError(ErrorCodes.UNAUTHORIZED, ErrorKeys.INVALID_CREDENTIALS, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function getUserById(id: string) {
  const user = await userRepository.findOne({ where: { id } });
  if (!user) {
    throw new CustomError(ErrorCodes.NOT_FOUND, ErrorKeys.USER_NOT_FOUND, "User not found");
  }
  return user;
}

export default { register, login, getUserById };
