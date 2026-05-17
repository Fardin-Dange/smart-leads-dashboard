import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-4">
      <section className="max-w-md rounded-lg border border-[#e3e7ef] bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-[#172033]">Page not found</h1>
        <p className="mt-2 text-sm text-[#667085]">This route does not exist.</p>
        <Link
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
          to="/"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
