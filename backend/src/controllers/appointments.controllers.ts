import { Request, Response } from "express";
import supabase from "../config/db";

export const GetAppointments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data, error } = await supabase.from("appointments").select(`
        id,
        customer_name,
        contact_info,
        appointment_date,
        treatments (
          name
        )
      `);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res
        .status(200)
        .json({ message: "No appointments found.", appointments: [] });
    }

    return res.status(200).json({ appointments: data });
  } catch (error: unknown) {
    console.error("Get appointments  error:", error);
    return res.status(500).json({
      message: "Something went wrong in GetAppointments controller.",
    });
  }
};

export const CreateAppointments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, phone, treatment, date } = req.body;

  if (!name || !phone || !treatment || !date) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          customer_name: name,
          contact_info: phone,
          treatment_id: treatment,
          appointment_date: date,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        message: "Failed to create appointment .",
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Appointment created successfully!",
      appointments: data,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Something went wrong in CreateAppointments controller.",
    });
  }
};

export const ConfirmAppointments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please select an appointment." });
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status: "confirm" })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        message: "Failed to confirm appointment.",
        error: error.message,
      });
    }

    return res.status(200).json({ message: "Appointment confirmed." });
  } catch (error: unknown) {
    console.error("Apointment confirmation error:", error);
    return res.status(500).json({
      message: "Something went wrong in ConfirmAppointment controller.",
    });
  }
};

export const DeleteAppointments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ message: "Deleted Succesfully!" });
  } catch (error: unknown) {
    console.error("Apointment deletion error:", error);
    return res.status(500).json({
      message: "Something went wrong in DeleteAppointments controller.",
    });
  }
};
