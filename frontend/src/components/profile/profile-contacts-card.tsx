import { useEffect, useState, useRef } from "react";
import { useAdminProfileStore } from "@/store/useAdminProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AdminDialog } from "../dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Contacts = () => {
  const [formValues, setFormValues] = useState({
    facebook: "",
    phone_number: "",
  });
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { authUser } = useAuthStore();
  const { contactsInfo, updateContacts, fetchContacts, isLoading } =
    useAdminProfileStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // normalize the name if needed
    const key = name === "phone-number" ? "phone_number" : name;

    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await updateContacts(contactsInfo?.id, formValues);
      if (success) {
        closeRef.current?.click();
        fetchContacts();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return (
    <>
      <Card className="gap-3">
        <CardHeader className="flex items-center justify-between ">
          <CardTitle>Personal Information</CardTitle>

          <AdminDialog
            title="Edit Contacts"
            description="Update the contacts details below."
            onSubmit={handleOnSubmit}
            loading={isLoading}
            closeRef={closeRef}
            trigger={
              <Button variant="outline" className="cursor-pointer" size={"sm"}>
                Edit <SquarePen className="h-4 w-4" />
              </Button>
            }
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  type="text"
                  value={formValues.facebook}
                  // defaultValue={selectedTreatment?.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  value={formValues.phone_number}
                  // defaultValue={selectedTreatment?.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </AdminDialog>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-gray-500 text-sm">Username</p>
              <p>{authUser?.username}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Facebook</p>
              <p>{contactsInfo?.facebook}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email Address</p>
              <p>{authUser?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p>{contactsInfo?.phone_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Contacts;
