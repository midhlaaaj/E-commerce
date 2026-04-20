export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white space-y-4 animate-in fade-in duration-500">
      <div className="w-12 h-12 relative flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
        Loading...
      </p>
    </div>
  );
}
