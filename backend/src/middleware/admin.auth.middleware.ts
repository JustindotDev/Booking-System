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
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const { data, error } = await supabase
      .from("admin")
      .select("id, username, email, profile_pic")
      .eq("id", decoded.id)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = data;

    next();
  } catch (error: unknown) {
    console.log("Error in ProtectRoute Middleware", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};
