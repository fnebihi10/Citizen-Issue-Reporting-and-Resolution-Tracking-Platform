export default function AdminLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-80 max-w-full rounded bg-slate-200" />
      <div className="mt-3 h-5 w-[34rem] max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 rounded-2xl border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="mt-6 h-80 rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}
