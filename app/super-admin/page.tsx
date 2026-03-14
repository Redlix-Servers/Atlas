export default function SuperAdminOverview() {
  return (
    <div className="p-8 sm:p-12 w-full flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Super Admin Overview</h1>
          <p className="text-zinc-400 text-sm">
            Welcome to the Global Administration panel.
          </p>
        </div>
      </div>
      <div className="text-zinc-500">
        <p>Use the Manage Clients tab to assign clients to downstream developers.</p>
      </div>
    </div>
  );
}
