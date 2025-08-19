import { useRef, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CircleAlert } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useAdminServiceStore } from "@/store/useAdminServiceStore";
import { Skeleton } from "../ui/skeleton";
import { AdminDialog } from "../dialog";
import useForm from "@/hooks/use-form";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [error, setError] = useState("");
  const { formData, handleChange } = useForm(
    {
      name: "",
      price: 0,
    },
    (name) => {
      if (name === "price") {
        setError("");
      }
    }
  );
  const { isFetching, createTreatments, fetchTreatments } =
    useAdminServiceStore();

  function handleValidation() {
    if (isNaN(Number(formData.price))) {
      setError("Price must be a number");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valid = handleValidation();

    if (valid) {
      const success = await createTreatments(formData);
      if (success) {
        closeRef.current?.click();
        fetchTreatments();
      }
    }
  };

  return (
    <>
      <div className="mb-3 flex justify-end">
        <AdminDialog
          trigger={
            <Button variant="outline" size="sm">
              <IconPlus />
              <span className="hidden lg:inline">Add Treatment</span>
            </Button>
          }
          title="Treatment"
          description="Enter the information below to add treatment."
          onSubmit={handleSubmit}
          closeRef={closeRef}
        >
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="eg. Haircut"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              name="price"
              placeholder="eg. 1999"
              value={formData.price}
              onChange={handleChange}
              required
            />
            {error && (
              <div className="flex items-center -mt-2">
                <CircleAlert className="text-red-600 h-4 w-4  ml-1 " />
                <span className="text-red-600 text-sm  ml-1 ">{error}</span>
              </div>
            )}
          </div>
        </AdminDialog>
      </div>

      <div className="overflow-hidden rounded-md border  ">
        <Table>
          <TableHeader className="bg-muted ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="pl-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="pl-4">
                      <Skeleton className="h-4 w-9/12" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pl-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
