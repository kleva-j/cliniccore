export const Stats = () => {
  return (
    <section className="py-16 lg:py-20 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">
              2min
            </p>
            <p className="text-sm font-medium text-slate-500">
              Patient Onboarding
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">
              99.9%
            </p>
            <p className="text-sm font-medium text-slate-500">System Uptime</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">
              Zero
            </p>
            <p className="text-sm font-medium text-slate-500">
              Infrastructure Cost
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">
              AES-256
            </p>
            <p className="text-sm font-medium text-slate-500">
              Data Encryption
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
