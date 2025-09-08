import { Request, Response } from "express";
import supabase from "../config/db";
import { AuthenticatedRequest } from "../types/express";

type UpdateContactstypes = {
  facebook?: string;
  phone_number?: string;
  address?: string;
};

export const GetContactsInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data, error } = await supabase.from("contacts_info").select();

    if (error) return res.status(400).json({ message: error.message });

    return res.status(200).json({ contacts_info: data[0] });
  } catch (error: unknown) {
    console.error("Get Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in GetContactInfo controller.",
    });
  }
};

export const InsertContactsInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No User" });
  }

  const { facebook, phone_number } = req.body;

  try {
    const { data, error } = await supabase
      .from("contacts_info")
      .insert({ facebook, phone_number })
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res
      .status(200)
      .json({ message: "Contacts inserted successfully.", data });
  } catch (error: unknown) {
    console.error("Update Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in InsertContactsInfo controller.",
    });
  }
};

export const UpdateContactsInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No User" });
  }

  const { id } = req.params;
  const { facebook, phone_number } = req.body;

  try {
    const { data, error } = await supabase
      .from("contacts_info")
      .update({ facebook, phone_number })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res
      .status(200)
      .json({ message: "Contacts updated successfully.", data });
  } catch (error: unknown) {
    console.error("Update Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in UpdateContactInfo controller.",
    });
  }
};

export const UpsertAddressInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No User" });
  }

  const { id } = req.params;
  const { province, city, barangay } = req.body;
  const address = province + city + barangay;

  const { data: current, error: fetchError } = await supabase
    .from("contacts_info")
    .select("address")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    return res.status(404).json({ message: "Contact not found" });
  }

  try {
    const updates: UpdateContactstypes = {};
    if (address && address !== current.address) updates.address = address;

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ message: "No changes detected." });
    }

    const { data, error } = await supabase
      .from("contacts_info")
      .upsert(updates)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res
      .status(200)
      .json({ message: "Address updated successfully.", data });
  } catch (error: unknown) {
    console.error("Update Contacts  error:", error);
    return res.status(500).json({
      message: "Something went wrong in UpdateContactInfo controller.",
    });
  }
};
