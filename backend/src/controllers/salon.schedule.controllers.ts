import { Request, Response } from "express";
import supabase from "../config/db";

export const getSchedule = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data, error } = await supabase.from("salon_schedule").select();

    if (error) return res.status(400).json({ message: error.message });

    if (!data || data.length === 0) {
      return res
        .status(200)
        .json({ message: "No schedule found.", schedule: [] });
    }

    return res.status(200).json({ schedule: data });
  } catch (error: unknown) {
    console.error("Get schedule  error:", error);
    return res.status(500).json({
      message: "Something went wrong in GetSchedule controller.",
    });
  }
};

export const ClosedSchedule = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Please choose a date." });
    }

    const { data: existing, error: findError } = await supabase
      .from("salon_schedule")
      .select()
      .eq("date", date)
      .eq("is_closed", true)
      .single();

    if (findError && findError.code !== "PGRST116") {
      return res.status(500).json({ message: findError.message });
    }

    if (existing) {
      return res
        .status(409)
        .json({ message: "This date is already marked as closed." });
    }

    const { error } = await supabase.from("salon_schedule").insert([
      {
        date,
        is_closed: true,
      },
    ]);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({ message: "Saved!" });
  } catch (error: unknown) {
    console.error("Error Message:", error);
    return res.status(500).json({
      message: "Something went wrong in the server.",
    });
  }
};

export const DeleteSchedule = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("salon_schedule")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ message: "Deleted Succesfully!" });
  } catch (error: unknown) {
    console.error("Schedule deletion error:", error);
    return res.status(500).json({
      message: "Something went wrong in DeletSchedule controller.",
    });
  }
};
