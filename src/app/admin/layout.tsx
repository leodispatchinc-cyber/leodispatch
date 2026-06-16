import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Leo Dispatch — Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="lg:flex">
        <AdminNav />

        {/* min-w-0 lets wide tables scroll inside their own container instead of
            pushing the whole page past the viewport. */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 hidden h-16 items-center justify-end gap-3 border-b border-line bg-ink/80 px-6 backdrop-blur lg:flex">
            <span className="truncate text-sm text-muted">admin@leodispatch.com</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yellow text-sm font-bold text-black">
              A
            </span>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
