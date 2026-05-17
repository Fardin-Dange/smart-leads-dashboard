import { Search } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import type { LeadQueryParams, LeadSort, LeadSource, LeadStatus } from "../types/lead";

interface LeadFiltersProps {
  filters: LeadQueryParams;
  searchValue: string;
  onFilterChange: (filters: Partial<LeadQueryParams>) => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
}

export function LeadFilters({
  filters,
  onFilterChange,
  onReset,
  onSearchChange,
  searchValue
}: LeadFiltersProps) {
  return (
    <section className="grid gap-3 rounded-lg border border-[#e3e7ef] bg-white p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
      <div className="relative">
        <Input
          className="pl-10"
          label="Search"
          name="search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Name or email"
          value={searchValue}
        />
        <Search className="absolute bottom-3 left-3 text-[#98a2b3]" size={18} />
      </div>

      <Select
        label="Status"
        name="status"
        onChange={(event) => {
          const value = event.target.value;
          onFilterChange({ status: value ? (value as LeadStatus) : undefined });
        }}
        options={[
          { label: "All", value: "" },
          { label: "New", value: "New" },
          { label: "Contacted", value: "Contacted" },
          { label: "Qualified", value: "Qualified" },
          { label: "Lost", value: "Lost" }
        ]}
        value={filters.status ?? ""}
      />

      <Select
        label="Source"
        name="source"
        onChange={(event) => {
          const value = event.target.value;
          onFilterChange({ source: value ? (value as LeadSource) : undefined });
        }}
        options={[
          { label: "All", value: "" },
          { label: "Website", value: "Website" },
          { label: "Instagram", value: "Instagram" },
          { label: "Referral", value: "Referral" }
        ]}
        value={filters.source ?? ""}
      />

      <Select
        label="Sort"
        name="sort"
        onChange={(event) => onFilterChange({ sort: event.target.value as LeadSort })}
        options={[
          { label: "Latest", value: "latest" },
          { label: "Oldest", value: "oldest" }
        ]}
        value={filters.sort ?? "latest"}
      />

      <div className="flex items-end">
        <Button className="w-full" onClick={onReset} type="button" variant="secondary">
          Reset
        </Button>
      </div>
    </section>
  );
}
