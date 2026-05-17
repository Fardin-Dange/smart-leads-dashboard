import { LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/client";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(state?.from?.pathname ?? "/", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-[#e3e7ef] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#172033]">Sign in</h1>
        <p className="mt-1 text-sm text-[#667085]">Access your leads workspace</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          disabled={isSubmitting}
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />

        {error ? <p className="rounded-md bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{error}</p> : null}

        <Button aria-busy={isSubmitting} disabled={isSubmitting} type="submit">
          <LogIn size={16} />
          {isSubmitting ? "Signing in" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[#667085]">
        New account{" "}
        <Link className="font-semibold text-[#2563eb]" to="/register">
          Register
        </Link>
      </p>
    </section>
  );
}
