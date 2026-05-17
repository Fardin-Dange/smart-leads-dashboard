import { useEffect, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import type { Lead, LeadFormValues, LeadSource, LeadStatus } from "../types/lead";

interface LeadFormProps {
  lead?: Lead | null;
  isSubmitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}

const defaultValues: LeadFormValues = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

export function LeadForm({ error, isSubmitting, lead, onCancel, onSubmit }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>(defaultValues);

  useEffect(() => {
    if (lead) {
      setValues({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source
      });
      return;
    }

    setValues(defaultValues);
  }, [lead]);

  const updateValue = <TKey extends keyof LeadFormValues>(
    key: TKey,
    value: LeadFormValues[TKey]
  ): void => {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input
        disabled={isSubmitting}
        label="Name"
        name="name"
        onChange={(event) => updateValue("name", event.target.value)}
        required
        value={values.name}
      />
      <Input
        disabled={isSubmitting}
        label="Email"
        name="email"
        onChange={(event) => updateValue("email", event.target.value)}
        required
        type="email"
        value={values.email}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          disabled={isSubmitting}
          label="Status"
          name="status"
          onChange={(event) => updateValue("status", event.target.value as LeadStatus)}
          options={[
            { label: "New", value: "New" },
            { label: "Contacted", value: "Contacted" },
            { label: "Qualified", value: "Qualified" },
            { label: "Lost", value: "Lost" }
          ]}
          value={values.status}
        />
        <Select
          disabled={isSubmitting}
          label="Source"
          name="source"
          onChange={(event) => updateValue("source", event.target.value as LeadSource)}
          options={[
            { label: "Website", value: "Website" },
            { label: "Instagram", value: "Instagram" },
            { label: "Referral", value: "Referral" }
          ]}
          value={values.source}
        />
      </div>

      {error ? <p className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button aria-busy={isSubmitting} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving" : lead ? "Update lead" : "Create lead"}
        </Button>
      </div>
    </form>
  );
}
