import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  return (
    <Sheet open={open} onOpenChange={openOnChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Appointment Details — {date}</SheetTitle>
          <SheetDescription>
            View all appointments scheduled for this date, including customer
            details, appointment status, and any related notes.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
