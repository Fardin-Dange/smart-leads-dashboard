import { ShieldCheck, UserRound } from "lucide-react";
import type { UserRole } from "../types/auth";

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === "admin";
  const Icon = isAdmin ? ShieldCheck : UserRound;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold capitalize ${
        isAdmin ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#eef4ff] text-[#1d4ed8]"
      }`}
    >
      <Icon size={15} />
      {role}
    </span>
  );
}
