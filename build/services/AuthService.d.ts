import { User } from "../entities/User";
export declare class AuthService {
    static register(email: string, password: string, firstName?: string, lastName?: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    static login(email: string, password: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    static getUserById(id: string): Promise<User>;
}
export default AuthService;
//# sourceMappingURL=AuthService.d.ts.map