import { type ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminDialog } from "@/components/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Treatment = {
  id: string;
  name: string;
  price: number;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getColumns = (
  onDelete: (treatment: Treatment) => void,
  onEdit: (treatment: Treatment) => void
): ColumnDef<Treatment>[] => [
  {
    accessorKey: "name",
    header: "Treatment",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const treatment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <MoreVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(treatment)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(treatment)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTreatment: Treatment | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const EditDialog = ({
  open,
  onOpenChange,
  selectedTreatment,
  onSubmit,
}: EditDialogProps) => {
  return (
    <AdminDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Treatment"
      description="Update the treatment details below."
      onSubmit={onSubmit}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Treatment Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={selectedTreatment?.name}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="text"
            defaultValue={selectedTreatment?.price}
            required
          />
        </div>
      </div>
    </AdminDialog>
  );
};
