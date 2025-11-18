import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);
//Nie ma sensu robić tego jako klasy, jeżeli wszystkie metody są static.
//Klasy są git do dependency injection, ale dependency injection zakłada, że będziesz miał instancje klasy.
export class AuthService {
  static async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) {
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });

    //Kazdy error powinien bvyc CustomErrorem, czyli jakas klasa dodatkowa common, z kodami itp.
    if (existingUser) {
      throw new Error("User with this email already exists");
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

  static async login(email: string, password: string) {
    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async getUserById(id: string) {
    return await userRepository.findOne({ where: { id } });
  }
}

export default AuthService;
