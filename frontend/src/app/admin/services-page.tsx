import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/ui/columns";
import { type Treatment } from "@/components/ui/columns";
import { useAdminServiceStore } from "@/store/useAdminServiceStore";
import { EditDialog } from "@/components/ui/columns";

export default function Services() {
  const { fetchTreatments, treatments, deleteTreatments, updateTreatments } =
    useAdminServiceStore();

  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);

    if (!selectedTreatment?.id) return;

    await updateTreatments(selectedTreatment.id, { name, price });

    setIsDialogOpen(false);
    setSelectedTreatment(null);
  };

  const columns = getColumns(handleDelete, handleEdit);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
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
      </SidebarInset>
      <EditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedTreatment={selectedTreatment}
        onSubmit={handleSubmit}
      />
    </SidebarProvider>
  );
}
