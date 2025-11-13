import { Request, Response } from "express";
import { fetchPortfolio, fetchTime } from "./service";

export async function getRoot(_req: Request, res: Response) {
  res.json({ message: "Hello from Node backend" });
}

export async function getHealth(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

export async function getApiTest(_req: Request, res: Response) {
  const ts = await fetchTime();
  res.json({ success: true, ts });
}

export async function getPortfolio(_req: Request, res: Response) {
  const userId = String(_req.query.user || "demo");
  const portfolio = await fetchPortfolio(userId);
  res.json({ portfolio });
}
