import { useEffect, useState, useRef } from "react";
import { useAdminProfileStore } from "@/store/useAdminProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AdminDialog } from "../dialog";
import { useSyncFormValues } from "@/hooks/use-sync-form-values";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Contacts = () => {
  const [isDisabled, setisDisabled] = useState<boolean>(true);
  const [formValues, setFormValues] = useState({
    facebook: "",
    phone_number: "",
    province: "",
    city: "",
    barangay: "",
  });
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { authUser } = useAuthStore();
  const { contactsInfo, updateContacts, fetchContacts, isLoading } =
    useAdminProfileStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useSyncFormValues(contactsInfo, setFormValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    const newValues = { ...formValues, [key]: value };

    setFormValues(newValues);

    if (
      newValues.facebook !== contactsInfo?.facebook ||
      newValues.phone_number !== contactsInfo?.phone_number ||
      newValues.province !== contactsInfo?.province ||
      newValues.city !== contactsInfo?.city ||
      newValues.barangay !== contactsInfo.barangay
    ) {
      setisDisabled(false);
    }
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

    setisDisabled(true);
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
            isdisabled={isDisabled}
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
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={formValues.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  name="province"
                  type="text"
                  value={formValues.province}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formValues.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  name="barangay"
                  type="text"
                  value={formValues.barangay}
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
          <CardTitle className="mt-6 mb-2">Address</CardTitle>
          <Separator className="mb-4" />
          <div className="flex gap-36">
            <div>
              <p className="text-gray-500 text-sm">Province</p>
              <p>{contactsInfo?.province}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">City/Municipality</p>
              <p>{contactsInfo?.city}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Barangay</p>
              <p>{contactsInfo?.barangay}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Contacts;
