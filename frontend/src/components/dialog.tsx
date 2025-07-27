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

interface AdminDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  closeRef?: RefObject<HTMLButtonElement | null>;
}

export function AdminDialog({
  trigger,
  title,
  description,
  children,
  onSubmit,
  closeRef,
}: AdminDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
