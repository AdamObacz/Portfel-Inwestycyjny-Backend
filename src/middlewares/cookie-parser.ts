import cookieParser from "cookie-parser";

export const cookieParserMiddleware = cookieParser(process.env.COOKIE_SECRET || "your-cookie-secret");

export default cookieParserMiddleware;
