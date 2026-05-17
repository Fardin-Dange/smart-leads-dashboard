import { Download, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/client";
import { leadsApi } from "../api/leads";
import { Button } from "../components/Button";
import { AccessLabel } from "../components/AccessLabel";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LeadFilters } from "../components/LeadFilters";
import { LeadForm } from "../components/LeadForm";
import { LeadTable } from "../components/LeadTable";
import { Modal } from "../components/Modal";
import { PaginationControls } from "../components/PaginationControls";
import { useAuth } from "../hooks/useAuth";
import { useDebounce } from "../hooks/useDebounce";
import type { Lead, LeadFormValues, LeadQueryParams } from "../types/lead";

interface PaginationState {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const defaultPagination: PaginationState = {
  total: 0,
  page: 1,
  pages: 1,
  limit: 10
};

const defaultFilters: LeadQueryParams = {
  page: 1,
  sort: "latest"
};

const normalizeFilters = (filters: LeadQueryParams): LeadQueryParams => {
  const normalized: LeadQueryParams = { ...filters };

  if (!normalized.status) delete normalized.status;
  if (!normalized.source) delete normalized.source;
  if (!normalized.search) delete normalized.search;

  return normalized;
};

export function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [filters, setFilters] = useState<LeadQueryParams>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const debouncedSearch = useDebounce(searchInput, 500);
  const canDelete = user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const fetchLeads = useCallback(async (query: LeadQueryParams): Promise<void> => {
    setIsLoading(true);
    setPageError(null);

    try {
      const response = await leadsApi.getLeads(normalizeFilters(query));
      setLeads(response.data);
      setPagination(response.pagination);
    } catch (requestError) {
      setPageError(getApiErrorMessage(requestError));
      setLeads([]);
      setPagination(defaultPagination);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setFilters((current) =>
      normalizeFilters({
        ...current,
        search: debouncedSearch.trim() || undefined,
        page: 1
      })
    );
  }, [debouncedSearch]);

  useEffect(() => {
    void fetchLeads(filters);
  }, [fetchLeads, filters]);

  const totalQualified = useMemo(
    () => leads.filter((lead) => lead.status === "Qualified").length,
    [leads]
  );

  const updateFilter = (nextFilters: Partial<LeadQueryParams>): void => {
    setFilters((current) =>
      normalizeFilters({
        ...current,
        ...nextFilters,
        page: nextFilters.page ?? 1
      })
    );
  };

  const openCreateModal = (): void => {
    setEditingLead(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (lead: Lead): void => {
    setEditingLead(lead);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeFormModal = (): void => {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingLead(null);
    setFormError(null);
  };

  const handleSaveLead = async (values: LeadFormValues): Promise<void> => {
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingLead) {
        await leadsApi.updateLead(editingLead._id, values);
      } else {
        await leadsApi.createLead(values);
      }

      setIsFormOpen(false);
      setEditingLead(null);
      setFormError(null);
      await fetchLeads(filters);
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (): Promise<void> => {
    if (!deletingLead) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await leadsApi.deleteLead(deletingLead._id);
      setDeletingLead(null);
      await fetchLeads(filters);
    } catch (requestError) {
      setDeleteError(getApiErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = (): void => {
    setSearchInput("");
    setFilters(defaultFilters);
  };

  const exportCurrentLeads = (): void => {
    if (!isAdmin || leads.length === 0) return;

    const headers = ["Name", "Email", "Status", "Source", "Owner", "Created At"];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.createdBy?.name ?? "",
      lead.createdAt
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172033]">Leads</h1>
          <p className="mt-1 text-sm text-[#667085]">
            {pagination.total} total records, {totalQualified} qualified on this page
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isAdmin ? (
            <Button
              disabled={isLoading || leads.length === 0}
              onClick={exportCurrentLeads}
              type="button"
              variant="secondary"
            >
              <Download size={16} />
              Export CSV
            </Button>
          ) : null}
          <Button
            disabled={isLoading}
            onClick={() => void fetchLeads(filters)}
            type="button"
            variant="secondary"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button onClick={openCreateModal} type="button">
            <Plus size={16} />
            New lead
          </Button>
        </div>
      </div>

      {user ? <AccessLabel role={user.role} /> : null}

      <LeadFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onSearchChange={setSearchInput}
        searchValue={searchInput}
      />

      {pageError ? (
        <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
          {pageError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-3 rounded-lg border border-[#e3e7ef] bg-white p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="h-14 animate-pulse rounded-md bg-[#eef2f7]" key={index} />
          ))}
        </div>
      ) : (
        <LeadTable
          canDelete={canDelete}
          leads={leads}
          onDelete={(lead) => {
            setDeleteError(null);
            setDeletingLead(lead);
          }}
          onEdit={openEditModal}
        />
      )}

      <PaginationControls
        onPageChange={(page) => updateFilter({ page })}
        page={pagination.page}
        pages={pagination.pages}
        total={pagination.total}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        title={editingLead ? "Edit lead" : "Create lead"}
      >
        <LeadForm
          error={formError}
          isSubmitting={isSaving}
          lead={editingLead}
          onCancel={closeFormModal}
          onSubmit={handleSaveLead}
        />
      </Modal>

      <ConfirmDialog
        confirmLabel="Delete lead"
        isOpen={Boolean(deletingLead)}
        isSubmitting={isDeleting}
        message={
          deleteError ??
          `Delete ${deletingLead?.name ?? "this lead"}? This action cannot be undone.`
        }
        onClose={() => {
          if (isDeleting) return;
          setDeletingLead(null);
          setDeleteError(null);
        }}
        onConfirm={() => void handleDeleteLead()}
        title="Delete lead"
      />
    </div>
  );
}
