import { Response, NextFunction } from "express";
import supabase from "../config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";

export const ProtectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const { data, error } = await supabase
      .from("admin")
      .select("id, username, email")
      .eq("id", decoded.id)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = data;

    next();
  } catch (error: unknown) {
    console.log("Error in ProtectRoute Middleware", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
