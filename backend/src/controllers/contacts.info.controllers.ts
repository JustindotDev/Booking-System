import { Request, Response } from "express";
import supabase from "../config/db";
import { AuthenticatedRequest } from "../types/express";

export const GetContactsInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data, error } = await supabase.from("contacts_info").select();

    if (error) return res.status(400).json({ message: error.message });

    return res.status(200).json({ contacts_info: data });
  } catch (error: unknown) {
    console.error("Get Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in GetContactInfo controller.",
    });
  }
};

export const AddContactsInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { facebook, phone_number, province, city, barangay } = req.body;

  if (!facebook || !phone_number || !province || city || !barangay) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields." });
  }

  const address: string = barangay + city + province;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No User" });
  }

  try {
    const { error } = await supabase.from("contacts_info").insert({
      facebook,
      phone_number,
      address,
    });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(200).json({ message: "Contacts Saved!" });
  } catch (error: unknown) {
    console.error("Add Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in AddContactInfo controller.",
    });
  }
};

export const UpdateContactsInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No User" });
  }
  try {
  } catch (error) {
    console.error("Update Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in UpdateContactInfo controller.",
    });
  }
};
