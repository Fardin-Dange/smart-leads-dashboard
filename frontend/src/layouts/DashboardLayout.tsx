import { BarChart3, LayoutDashboard, LogOut, Menu, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { RoleBadge } from "../components/RoleBadge";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users }
] as const;

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-[#e3e7ef] bg-white transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-[#e3e7ef] px-5">
            <div className="grid size-10 place-items-center rounded-md bg-[#2563eb] text-white">
              <BarChart3 size={22} />
            </div>
            <div>
              <p className="font-bold text-[#172033]">Smart Leads</p>
              <p className="text-xs text-[#667085]">Sales dashboard</p>
            </div>
          </div>

          <nav className="grid gap-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#eef4ff] text-[#1d4ed8]"
                        : "text-[#344054] hover:bg-[#f8fafc]"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                  to={item.href}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#e3e7ef] p-4">
            <div className="mb-3 rounded-md bg-[#f8fafc] p-3">
              <p className="text-sm font-semibold text-[#172033]">{user?.name}</p>
              <p className="truncate text-xs text-[#667085]">{user?.email}</p>
              <div className="mt-3">{user ? <RoleBadge role={user.role} /> : null}</div>
            </div>
            <Button className="w-full" onClick={handleLogout} type="button" variant="secondary">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-[#172033]/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-[#e3e7ef] bg-white px-4 py-3 sm:px-6">
          <button
            aria-label="Open navigation"
            className="grid size-10 place-items-center rounded-md border border-[#d6dbe6] text-[#344054] lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            type="button"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-[#667085]">MERN Smart Leads Dashboard</p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-semibold text-[#172033]">{user?.name}</p>
              <p className="truncate text-xs text-[#667085]">{user?.email}</p>
            </div>
            {user ? <RoleBadge role={user.role} /> : null}
            <Button
              aria-label="Logout"
              className="size-10 px-0"
              onClick={handleLogout}
              type="button"
              variant="ghost"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
