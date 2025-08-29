import type { ReactNode, FormEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AdminDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  closeRef?: RefObject<HTMLButtonElement | null>;
  loading?: boolean;
  isdisabled?: boolean;
}

export function AdminDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  closeRef,
  loading = false,
  isdisabled = false,
}: AdminDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">{children}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading || isdisabled}>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
