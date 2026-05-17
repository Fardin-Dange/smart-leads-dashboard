import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

export function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <section className="rounded-lg border border-[#e3e7ef] bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#667085]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#172033]">{value}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-md bg-[#eef4ff] text-[#2563eb]">
          {icon}
        </div>
      </div>
    </section>
  );
}
