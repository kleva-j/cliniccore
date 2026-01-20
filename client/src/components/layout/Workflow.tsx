export const Workflow = () => {
  return (
    <section className="bg-white pt-24 pb-24 relative" id="workflow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider bg-slate-100 text-slate-600">
              Workflow
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">
              Built for
              <span className="text-indigo-600">Teams</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              Distinct dashboards for every role in your clinic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
            <div className="aspect-[16/10] w-full relative bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&amp;fit=crop&amp;q=80&amp;w=800"
                alt="Receptionist"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>User Hand-Up Linear</title>
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                      stroke-linecap="round"
                      d="M8 13h8m-8 0v5c0 1.886 0 2.828.586 3.414S10.114 22 12 22s2.828 0 3.414-.586S16 19.886 16 18v-5m-8 0a7.46 7.46 0 0 1-5.618-5.472L2 6m14 7c1.71 0 3.15 1.28 3.35 2.98L20 21.5"
                    />
                    <circle cx="12" cy="6" r="4" />
                  </g>
                </svg>
                <h4 className="text-lg font-semibold text-slate-900">
                  The Receptionist
                </h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Registers patients, manages the daily schedule, and handles
                check-ins. Read-only access to clinical data preserves privacy.
              </p>
            </div>
          </div>

          <div className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
            <div className="aspect-[16/10] w-full relative bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&amp;fit=crop&amp;q=80&amp;w=800"
                alt="Doctor"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Stethoscope Bold</title>
                  <path
                    fill="currentColor"
                    d="M12 1.25a.75.75 0 0 1 .75.75v.251a3.75 3.75 0 0 1 3.7 3.418c.014.166.014.354.014.629V7.52c0 3.87-2.944 7.05-6.714 7.427V17A4.25 4.25 0 0 0 14 21.25h.882a3.37 3.37 0 0 0 3.108-2.068q.06-.142.085-.327A3.001 3.001 0 0 1 19 13a3 3 0 0 1 .575 5.945a2.9 2.9 0 0 1-.201.817a4.87 4.87 0 0 1-4.492 2.988H14A5.75 5.75 0 0 1 8.25 17v-2.05a7.75 7.75 0 0 1-7-7.715v-.937c0-.275 0-.463.015-.628A3.75 3.75 0 0 1 4.67 2.265a7 7 0 0 1 .58-.015V2a.75.75 0 1 1 1.5 0v2a.75.75 0 0 1-1.5 0v-.25c-.263 0-.366.001-.448.009a2.25 2.25 0 0 0-2.043 2.043c-.008.09-.009.206-.009.535v.898A6.25 6.25 0 0 0 9 13.485a5.964 5.964 0 0 0 5.964-5.964V6.337c0-.329 0-.445-.008-.535a2.25 2.25 0 0 0-2.206-2.05V4a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75"
                  />
                </svg>
                <h4 className="text-lg font-semibold text-slate-900">
                  The Doctor
                </h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Focuses on patient care. Views personal schedule, documents
                visits, and accesses history for assigned patients only.
              </p>
            </div>
          </div>

          <div className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
            <div className="aspect-[16/10] w-full relative bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;q=80&amp;w=800"
                alt="Admin"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Settings Linear</title>
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M13.765 2.152C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7s-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453s.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.62 1.62 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z" />
                  </g>
                </svg>
                <h4 className="text-lg font-semibold text-slate-900">
                  The Admin
                </h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Total governance. Manages user accounts, configures system
                settings, and reviews security audit logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
