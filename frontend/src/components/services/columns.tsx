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
            {/* REFACTOR: Open a modal instead of deletign directly for better UX */}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                onDelete(treatment);
              }}
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
  loading: boolean;
  isdisabled: boolean;
  formValues: { name: string; price: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditDialog = ({
  open,
  onOpenChange,
  selectedTreatment,
  onSubmit,
  loading = false,
  isdisabled = false,
  formValues,
  onInputChange,
}: EditDialogProps) => {
  return (
    <AdminDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Treatment"
      description="Update the treatment details below."
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
