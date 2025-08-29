import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/services/data-table";
import { getColumns } from "@/components/services/columns";
import { type Treatment } from "@/components/services/columns";
import { useAdminServiceStore } from "@/store/useAdminServiceStore";
import { EditDialog } from "@/components/services/columns";

export default function Services() {
  const {
    fetchTreatments,
    treatments,
    deleteTreatments,
    updateTreatments,
    isLoading,
  } = useAdminServiceStore();

  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({ name: "", price: "" });
  const [ischanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const handleDelete = async (treatment: Treatment) => {
    try {
      await deleteTreatments(treatment.id);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setFormValues({
      name: treatment.name,
      price: treatment.price.toString(),
    });
    setIsChanged(true);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    if (
      newValues.name !== selectedTreatment?.name ||
      parseFloat(newValues.price) !== selectedTreatment?.price
    ) {
      setIsChanged(false);
    } else if (
      newValues.name === selectedTreatment?.name ||
      parseFloat(newValues.price) === selectedTreatment?.price
    ) {
      setIsChanged(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTreatment?.id) return;

    await updateTreatments(selectedTreatment.id, {
      name: formValues.name,
      price: parseFloat(formValues.price),
    });

    setIsDialogOpen(false);
    setSelectedTreatment(null);
  };

  const columns = getColumns(handleDelete, handleEdit);

  return (
    <SidebarInset>
      <SiteHeader title="Services" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <DataTable columns={columns} data={treatments} />
            </div>
          </div>
        </div>
      </div>
      <EditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedTreatment={selectedTreatment}
        onSubmit={handleSubmit}
        loading={isLoading}
        isdisabled={ischanged}
        formValues={formValues}
        onInputChange={handleInputChange}
      />
    </SidebarInset>
  );
}
