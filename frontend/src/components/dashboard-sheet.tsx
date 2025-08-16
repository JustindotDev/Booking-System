import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "./dashboard-data-table";
import {
  type AppointmentDetails,
  columns,
} from "@/components/dashboard-columns";

import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";

interface DashboardSheetProps {
  open: boolean;
  openOnChange: (open: boolean) => void;
  date: string;
}

export const DashboardSheet = ({
  open,
  openOnChange,
  date,
}: DashboardSheetProps) => {
  const {
    appointments,
    confirmAppointments,
    cancelAppointments,
    fetchAppointments,
  } = useAdminDashboardStore();

  const handleConfirm = async (appointment: AppointmentDetails) => {
    if (!appointment.id) return;
    try {
      await confirmAppointments(appointment.id);
    } catch (error) {
      console.log(error);
    }
    fetchAppointments();
  };

  const handleCancel = (appointment: AppointmentDetails) => {
    if (!appointment.id) return;
    try {
      cancelAppointments(appointment.id);
    } catch (error) {
      console.log(error);
    }

    fetchAppointments();
  };

  const getColumns = columns({
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  });
  return (
    <Sheet open={open} onOpenChange={openOnChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Appointment Details — {date}</SheetTitle>
          <SheetDescription>
            View all appointments scheduled for this date, including customer
            details, appointment status, and any related notes.
          </SheetDescription>
          <DataTable columns={getColumns} data={appointments} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
