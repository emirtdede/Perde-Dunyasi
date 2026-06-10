import { AdminSidebar } from "@/src/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar />
        <section className="glass-card rounded-[2rem] p-6 sm:p-8">{children}</section>
      </div>
    </div>
  );
}
