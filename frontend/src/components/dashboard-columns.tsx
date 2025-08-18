import { type ColumnDef } from "@tanstack/react-table";
import { type Appointments } from "@/store/useAdminDashboardStore";
import { cn } from "@/utils/utils";

import { MoreVertical } from "lucide-react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AppointmentDetails = Partial<Appointments>;

interface ColumnProps {
  onConfirm: (appointment: AppointmentDetails) => void;
  onCancel: (appointment: AppointmentDetails) => void;
}

export const columns = ({
  onConfirm,
  onCancel,
}: ColumnProps): ColumnDef<AppointmentDetails>[] => [
  {
    accessorKey: "customer_name",
    header: "Name",
    cell: ({ getValue }) => (
      <div className="max-w-[150px] whitespace-normal break-words">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "contact_info",
    header: "Contact No.",
  },
  {
    accessorKey: "treatments.name",
    header: "Treatment",
    cell: ({ getValue }) => (
      <div className="max-w-[150px] whitespace-normal break-words">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap = {
        pending: "bg-blue-100 text-blue-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      };

      const statusColor =
        statusMap[status as keyof typeof statusMap] ||
        "bg-gray-100 text-gray-800";

      return (
        <span
          className={cn(
            " px-2 py-1 rounded-sm text-xs font-medium ",
            statusColor
          )}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      const isConfirmed = appointment.status === "confirmed";

      return (
        <div className="flex justify-end ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isCancelled}
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-green-700 bg-green-50 mb-1 hover:!bg-green-100 hover:!text-green-700 cursor-pointer transition-colors"
                onClick={() => onConfirm(appointment)}
                disabled={isConfirmed}
              >
                <Check className="h-4 w-4 text-green-700" />
                Confirm
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:!bg-red-100 hover:!text-red-700 cursor-pointer transition-colors"
                onClick={() => onCancel(appointment)}
              >
                <X className="h-4 w-4 text-red-700" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
