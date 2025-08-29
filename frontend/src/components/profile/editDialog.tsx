import { AdminDialog } from "../dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const editDialog = () => {
  return (
    <AdminDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Contacts"
      description="Update the contacts details below."
      onSubmit={onSubmit}
      loading={loading}
      isdisabled={isdisabled}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Treatment Name</Label>
          <Input
            id="name"
            name="name"
            value={formValues.name}
            defaultValue={selectedTreatment?.name}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            value={formValues.price}
            type="text"
            defaultValue={selectedTreatment?.price}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </AdminDialog>
  );
};

export default editDialog;
