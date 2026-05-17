import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationControlsProps {
  page: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ onPageChange, page, pages, total }: PaginationControlsProps) {
  const safePages = pages || 1;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#667085]">
        Page {page} of {safePages} ({total} records)
      </p>
      <div className="flex gap-2">
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
          variant="secondary"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button
          disabled={page >= safePages}
          onClick={() => onPageChange(page + 1)}
          type="button"
          variant="secondary"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
