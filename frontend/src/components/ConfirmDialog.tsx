import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  confirmLabel,
  isOpen,
  isSubmitting,
  message,
  onClose,
  onConfirm,
  title
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="grid gap-5">
        <div className="flex gap-3 rounded-md bg-[#fff7ed] p-3 text-[#9a3412]">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          <p className="text-sm">{message}</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            className="bg-[#dc2626] hover:bg-[#b91c1c]"
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? "Deleting" : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
