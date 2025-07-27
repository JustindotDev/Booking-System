import { Request, Response } from "express";
import supabase from "../config/db";

type TreatmentUpdate = {
  name?: string;
  image?: string;
  price?: number;
};

export const GetTreatments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data, error } = await supabase.from("treatments").select();

    if (error) return res.status(400).json({ message: error.message });

    if (!data || data.length === 0) {
      return res
        .status(200)
        .json({ message: "No treatments found.", treatments: [] });
    }

    return res.status(200).json({
      treatments: data.map((treatment) => ({
        id: treatment.id,
        treatment: treatment.name,
        price: treatment.price,
      })),
    });
  } catch (error: unknown) {
    console.error("Get treatment  error:", error);
    return res.status(500).json({
      message: "Something went wrong in GetTreatments controller.",
    });
  }
};

export const CreateTreatments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, image, price } = req.body;

    if (!name || price === undefined || isNaN(price)) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }

    const { data, error } = await supabase
      .from("treatments")
      .insert([
        {
          name,
          image,
          price,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({
        message: "Failed to create user treatments.",
        error: error.message || error.details,
      });
    }

    return res
      .status(200)
      .json({ message: "Treatment created successfully!", treatment: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Treatment creation error:", error.message);
    } else {
      console.error("Treatment creation error:", error);
    }
    return res.status(500).json({
      message: "Something went wrong in CreateTreatments controller.",
    });
  }
};

export const UpdateTreatments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, image, price } = req.body;

    const updates: TreatmentUpdate = {};
    if (name) updates.name = name;
    if (image) updates.image = image;
    if (price !== undefined) updates.price = price;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    const { data, error } = await supabase
      .from("treatments")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update error:", error);
      return res
        .status(500)
        .json({ message: "Failed to update treatment.", error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Treatment not found." });
    }

    return res
      .status(200)
      .json({ message: "Treatment updated successfully.", treatment: data[0] });
  } catch (error: unknown) {
    console.error("Treatment update error:", error);
    return res.status(500).json({
      message: "Something went wrong in UpdateTreatments controller.",
    });
  }
};

export const DeleteTreatments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("treatments").delete().eq("id", id);

    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ message: "Deleted Succesfully!" });
  } catch (error: unknown) {
    console.error("Treatment deletion error:", error);
    return res.status(500).json({
      message: "Something went wrong in DeleteTreatments controller.",
    });
  }
};
