import { User } from "../entities/User";
export declare function register(email: string, password: string, firstName?: string, lastName?: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}>;
export declare function login(email: string, password: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}>;
export declare function getUserById(id: string): Promise<User>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    getUserById: typeof getUserById;
};
export default _default;
//# sourceMappingURL=AuthService.d.ts.map