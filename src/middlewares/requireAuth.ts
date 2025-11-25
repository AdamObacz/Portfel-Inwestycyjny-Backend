/**
 * Middleware to require authentication
 * Checks if user is logged in via session
 */
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Authentication required",
      errorKey: "unauthorized",
    });
  }

  // User is authenticated, proceed
  next();
}

export default requireAuth;
