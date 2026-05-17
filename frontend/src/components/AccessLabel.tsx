import { LockKeyhole, ShieldCheck } from "lucide-react";
import type { UserRole } from "../types/auth";

interface AccessLabelProps {
  role: UserRole;
}

export function AccessLabel({ role }: AccessLabelProps) {
  const isAdmin = role === "admin";
  const Icon = isAdmin ? ShieldCheck : LockKeyhole;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        isAdmin
          ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
          : "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
      }`}
    >
      <Icon className="mt-0.5 shrink-0" size={18} />
      <div>
        <p className="text-sm font-bold">{isAdmin ? "Admin panel" : "Limited access"}</p>
        <p className="mt-1 text-sm">
          {isAdmin
            ? "You can manage leads, delete records, and export the current view."
            : "You can create and update leads. Delete and export actions are reserved for admins."}
        </p>
      </div>
    </div>
  );
}
