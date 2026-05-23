/**
 * Full-page skeleton shown during lazy route loading
 */
function SkeletonPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

export default SkeletonPage;
