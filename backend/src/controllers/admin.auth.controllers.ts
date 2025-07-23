import { Request, Response } from "express";
import supabase from "../config/db";
import { validatePassword } from "../util/password.validator";
import { setTokens } from "../util/set.token";
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
      return res.status(401).json({
        emailError: "Email not found",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }
      return res.status(401).json({
        message: error.message,
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin")
      .select("username")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({
        message: "Failed to retrieve user profile",
      });
    }

    setTokens(res, data.user, data.session);

    return res.status(200).json({
      message: "Logged in Successfully!",
      user: {
        id: data.user.id,
        username: profile?.username,
        email,
      },
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

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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

export const CheckAuth = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    return res.status(200).json(req.user);
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
