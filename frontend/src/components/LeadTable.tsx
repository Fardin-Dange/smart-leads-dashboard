import { Edit3, Trash2 } from "lucide-react";
import { Button } from "./Button";
import type { Lead } from "../types/lead";

const statusStyles: Record<Lead["status"], string> = {
  New: "bg-[#eef4ff] text-[#1d4ed8]",
  Contacted: "bg-[#f0fdf4] text-[#15803d]",
  Qualified: "bg-[#fff7ed] text-[#c2410c]",
  Lost: "bg-[#fef2f2] text-[#b91c1c]"
};

interface LeadTableProps {
  canDelete: boolean;
  leads: Lead[];
  onDelete: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}

export function LeadTable({ canDelete, leads, onDelete, onEdit }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-white p-8 text-center text-sm text-[#667085]">
        No leads found
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#e3e7ef] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f8fafc] text-xs font-semibold uppercase tracking-[0.04em] text-[#667085]">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf1f7]">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-[#f8fafc]">
                <td className="px-4 py-4">
                  <div className="font-semibold text-[#172033]">{lead.name}</div>
                  <div className="text-[#667085]">{lead.email}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[#344054]">{lead.source}</td>
                <td className="px-4 py-4">
                  <div className="text-[#344054]">{lead.createdBy?.name ?? "Unassigned"}</div>
                  <div className="text-xs text-[#667085]">{lead.createdBy?.role ?? ""}</div>
                </td>
                <td className="px-4 py-4 text-[#667085]">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }).format(new Date(lead.createdAt))}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      aria-label={`Edit ${lead.name}`}
                      className="size-9 px-0"
                      onClick={() => onEdit(lead)}
                      type="button"
                      variant="ghost"
                    >
                      <Edit3 size={16} />
                    </Button>
                    {canDelete ? (
                      <Button
                        aria-label={`Delete ${lead.name}`}
                        className="size-9 px-0 text-[#b91c1c] hover:bg-[#fef2f2]"
                        onClick={() => onDelete(lead)}
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 size={16} />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
