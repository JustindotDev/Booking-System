import jwt from "jsonwebtoken";

type UserPayload = {
  id: string;
  username: string;
  email: string;
  profile_pic: string;
};

export const generateAccessToken = (user: UserPayload) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m", // 15 minute (short-lived)
  });
};

export const generateRefreshToken = (user: UserPayload) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d", // long-lived
  });
};
