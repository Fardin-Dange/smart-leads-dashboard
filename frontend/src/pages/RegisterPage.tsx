import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/client";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ name, email, password, role });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-[#e3e7ef] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#172033]">Create account</h1>
        <p className="mt-1 text-sm text-[#667085]">Start managing leads</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          disabled={isSubmitting}
          label="Name"
          name="name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          label="Email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        <Select
          disabled={isSubmitting}
          label="Role"
          name="role"
          onChange={(event) => setRole(event.target.value as UserRole)}
          options={[
            { label: "Sales", value: "sales" },
            { label: "Admin", value: "admin" }
          ]}
          value={role}
        />

        {error ? <p className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</p> : null}

        <Button aria-busy={isSubmitting} disabled={isSubmitting} type="submit">
          <UserPlus size={16} />
          {isSubmitting ? "Creating" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[#667085]">
        Existing account{" "}
        <Link className="font-semibold text-[#2563eb]" to="/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}
