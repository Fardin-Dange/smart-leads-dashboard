import { Clock3, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { leadsApi } from "../api/leads";
import { StatTile } from "../components/StatTile";
import type { Lead } from "../types/lead";

export function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    void leadsApi
      .getLeads({ sort: "latest" })
      .then((response) => setLeads(response.data))
      .catch(() => setLeads([]));
  }, []);

  const stats = useMemo(() => {
    const qualified = leads.filter((lead) => lead.status === "Qualified").length;
    const newLeads = leads.filter((lead) => lead.status === "New").length;

    return {
      total: leads.length,
      qualified,
      newLeads,
      conversion: leads.length > 0 ? Math.round((qualified / leads.length) * 100) : 0
    };
  }, [leads]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#172033]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#667085]">Latest lead activity and pipeline health</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Users size={22} />} label="Total leads" value={stats.total} />
        <StatTile icon={<Target size={22} />} label="Qualified" value={stats.qualified} />
        <StatTile icon={<Clock3 size={22} />} label="New leads" value={stats.newLeads} />
        <StatTile icon={<TrendingUp size={22} />} label="Conversion" value={`${stats.conversion}%`} />
      </div>

      <section className="rounded-lg border border-[#e3e7ef] bg-white p-5">
        <h2 className="text-lg font-bold text-[#172033]">Recent leads</h2>
        <div className="mt-4 grid gap-3">
          {leads.slice(0, 5).map((lead) => (
            <div
              className="flex flex-col gap-2 rounded-md border border-[#edf1f7] p-3 sm:flex-row sm:items-center sm:justify-between"
              key={lead._id}
            >
              <div>
                <p className="font-semibold text-[#172033]">{lead.name}</p>
                <p className="text-sm text-[#667085]">{lead.email}</p>
              </div>
              <span className="w-fit rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#1d4ed8]">
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
