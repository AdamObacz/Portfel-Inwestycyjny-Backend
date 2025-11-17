import HyperExpress from "hyper-express";
import AuthService from "../services/AuthService";

const router = new HyperExpress.Router();

// Middleware to check if user is authenticated
function requireAuth(req: any) {
  if (!req.session || !req.session.userId) {
    return false;
  }
  return true;
}

// POST /auth/register
router.post("/register", async (req: any, res: any) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await AuthService.register(email, password, firstName, lastName);

    // Set session
    if (req.session) {
      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("Register error:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

// POST /auth/login
router.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await AuthService.login(email, password);

    // Set session
    if (req.session) {
      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    return res.status(200).json({
      message: "Logged in successfully",
      user,
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return res.status(401).json({ error: error.message });
  }
});

// GET /auth/me - Get current user
router.get("/me", async (req: any, res: any) => {
  try {
    if (!requireAuth(req)) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.session.userId;
    const user = await AuthService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    console.error("Get current user error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/logout
router.post("/logout", (req: any, res: any) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    return res.status(400).json({ error: "No session to destroy" });
  }
});

export default router;
