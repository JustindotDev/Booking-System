import { Response } from "express";
import jwt from "jsonwebtoken";

type Session = {
  access_token: string;
  refresh_token: string;
};
type User = {
  id: string;
  username?: string;
  email?: string;
};

export const setTokens = (res: Response, user: User, session: Session) => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.cookie("access_token", session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refresh_token", session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
