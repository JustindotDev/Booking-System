import { Request, Response } from "express";
import supabase from "../config/db";
import { validatePassword } from "../util/password.validator";
import { generateAccessToken, generateRefreshToken } from "../util/token";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decode } from "base64-arraybuffer";
import { AuthenticatedRequest } from "../types/express";

export const Signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { data: userEmail, error: emailError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (emailError && emailError.code === "22P02") {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (userEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    if (!password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res
        .status(400)
        .json({ passwordError: passwordValidation.message });
    }

    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      return res.status(500).json({ message: signupError.message });
    }

    const userId = authData.user?.id;

    const { error: insertError } = await supabase.from("admin").insert([
      {
        id: userId,
        username,
        email,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return res.status(500).json({
        message: "Failed to create user profile.",
        error: insertError.message || insertError.details,
      });
    }

    return res.status(200).json({
      message: "Signup successful!",
      user: {
        id: userId,
        username,
        email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Signup error:", error.message);
    } else {
      console.error("Signup error:", error);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong in signup controller." });
  }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const { data: userData } = await supabase
      .from("admin")
      .select("email")
      .eq("email", email)
      .single();

    if (!userData) {
      return res.status(200).json({
        success: false,
        message: "Email not found",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return res.status(200).json({
          success: false,
          message: "Incorrect password",
        });
      }
      return res.status(200).json({
        success: false,
        message: error.message,
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin")
      .select("username, profile_pic")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({
        message: "Failed to retrieve user profile",
      });
    }

    const userPayload = {
      id: data.user.id,
      username: profile?.username || "",
      email: email,
      profile_pic: profile.profile_pic,
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully!",
      user: {
        id: data.user.id,
        username: profile?.username,
        profile_pic: profile?.profile_pic,
        email,
      },
      accessToken,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
    } else {
      console.error("Login error:", error);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong in login controller." });
  }
};

export const Logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout Successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Logout error:", error.message);
    } else {
      console.error("Logout error:", error);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong in logout controller." });
  }
};

export const UploadProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { profile_pic } = req.body;
    if (!profile_pic) {
      return res.status(400).json({ message: "Please select an image." });
    }

    const userId = req.user?.id;
    const username = req.user?.username;

    const base64Data = profile_pic.replace(/^data:image\/\w+;base64,/, "");
    const buffer = decode(base64Data);

    const filePath = `${username}/${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from("profile-picture")
      .upload(filePath, buffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { data: publicUrl } = supabase.storage
      .from("profile-picture")
      .getPublicUrl(filePath);

    const { error: userError } = await supabase
      .from("admin")
      .update({ profile_pic: publicUrl.publicUrl })
      .eq("id", userId)
      .select();

    if (userError) return res.status(400).json({ message: userError.message });

    return res.status(201).json({
      message: "Profile saved succesffully",
      publicUrl: publicUrl.publicUrl,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("UploadProfile error:", error.message);
    } else {
      console.error("UploadProfile error:", error);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong in UploadProfile controller." });
  }
};

export const CheckAuth = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    return res
      .status(200)
      .json({ user: req.user, accessToken: req.cookies["access_token"] });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("checkAuth error:", error.message);
    } else {
      console.error("checkAuth error:", error);
    }
    return res
      .status(500)
      .json({ message: "Something went wrong in checkAuth controller." });
  }
};

export const RefreshAccessToken = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      profile_pic: decoded.profile_pic,
    });

    // Send new access token as cookie
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({ message: "Token refresh failed" });
  }
};
