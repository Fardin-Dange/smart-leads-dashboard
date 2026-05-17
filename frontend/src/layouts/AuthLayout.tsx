import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-[#f6f7f9] px-4 py-8">
      <div className="mx-auto grid w-full max-w-md content-center">
        <Outlet />
      </div>
    </main>
  );
}
