import { useAuthStore } from "@/store/useAuthStore";
import { AdminDialog } from "../dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Address = () => {
  const { authUser } = useAuthStore();

  const handleOnSubmit = () => {};
  return (
    <>
      <Card className="gap-3 ">
        <CardHeader className="flex items-center justify-between ">
          <CardTitle>Address</CardTitle>
          <AdminDialog
            title="Edit Address"
            description="Update the address details below."
            onSubmit={handleOnSubmit}
            // loading={loading}
            // isdisabled={isdisabled}
            trigger={
              <Button variant="outline" className="cursor-pointer" size={"sm"}>
                Edit <SquarePen className="h-4 w-4" />
              </Button>
            }
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  name="province"
                  type="text"
                  // value={formValues.name}
                  // defaultValue={selectedTreatment?.name}
                  // onChange={onInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City/Municipality</Label>
                <Input
                  id="city"
                  name="city"
                  // value={formValues.price}
                  type="text"
                  // defaultValue={selectedTreatment?.price}
                  // onChange={onInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  name="barangay"
                  // value={formValues.price}
                  type="text"
                  // defaultValue={selectedTreatment?.price}
                  // onChange={onInputChange}
                  required
                />
              </div>
            </div>
          </AdminDialog>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex gap-36">
            <div>
              <p className="text-gray-500 text-sm">Province</p>
              <p>{authUser?.username}</p>
            </div>
            <p className="text-gray-500 text-sm">City/Municipality</p>
            <div>
              <p className="text-gray-500 text-sm">Barangay</p>
              <p className="font-sans">{authUser?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Address;
