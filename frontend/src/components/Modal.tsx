import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg border border-[#e3e7ef] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e3e7ef] px-5 py-4">
          <h2 className="text-lg font-bold text-[#172033]">{title}</h2>
          <button
            aria-label="Close modal"
            className="grid size-9 place-items-center rounded-md text-[#667085] hover:bg-[#f2f4f7]"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
