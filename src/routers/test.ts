import HyperExpress from "hyper-express";

const router = new HyperExpress.Router();

router.get("/test", async (req, res) => {
  return res.json({ message: "Test route is working!" });
});
export default router;
