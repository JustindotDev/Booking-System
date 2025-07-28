import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/ui/columns";
import { type Treatment } from "@/components/ui/columns";
import { useAdminServiceStore } from "@/store/useAdminServiceStore";
import { useEffect } from "react";

export default function Services() {
  const { fetchTreatments, treatments, deleteTreatments } =
    useAdminServiceStore();

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

  // const handleEdit = async (treatment: Treatment) => {
  //   try {
  //     await updateTreatments(treatment.id, data);
  //   } catch (err) {
  //     console.error("Failed to delete:", err);
  //   }
  // };

  const columns = getColumns(handleDelete);

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
    </SidebarProvider>
  );
}
