export const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-slate-50">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-slate-900">
            Core
            <span className="text-indigo-600">Capabilities</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Everything you need to run an outpatient department, and nothing you
            don't.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>User Plus Linear</title>
                <g fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="6" r="4" />
                  <path d="M15 13.327A13.6 13.6 0 0 0 12 13c-4.418 0-8 2.015-8 4.5S4 22 12 22c5.687 0 7.331-1.018 7.807-2.5" />
                  <circle cx="18" cy="16" r="4" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 14.667v2.666M16.667 16h2.666"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              Patient Registration
            </h3>
            <p className="leading-relaxed text-sm text-slate-500">
              Capture essential data including demographics and emergency
              contacts in under 2 minutes with fuzzy search.
            </p>
          </div>

          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Calendar Add Linear</title>
                <g fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
                  <path
                    stroke-linecap="round"
                    d="M18 16h-2m0 0h-2m2 0v-2m0 2v2M7 4V2.5M17 4V2.5M2.5 9h19"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              Conflict-Free Scheduling
            </h3>
            <p className="leading-relaxed text-sm text-slate-500">
              Smart booking system with doctor-specific slots and automatic
              detection of overlapping appointments.
            </p>
          </div>

          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Stethoscope Linear</title>
                <g fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 14.235V17a5 5 0 0 0 5 5h.882a4.12 4.12 0 0 0 3.964-3" />
                  <path
                    stroke-linecap="round"
                    d="M5.429 3h-.092c-.313 0-.47 0-.601.012a3 3 0 0 0-2.724 2.724C2 5.868 2 6.024 2 6.336v.9a7 7 0 0 0 7 7a6.714 6.714 0 0 0 6.714-6.715V6.337c0-.313 0-.47-.011-.601a3 3 0 0 0-2.724-2.724C12.847 3 12.69 3 12.377 3h-.091"
                  />
                  <circle cx="19" cy="16" r="3" />
                  <path stroke-linecap="round" d="M12 2v2M6 2v2" />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              Clinical Documentation
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Structured visit notes including ICD-10 diagnosis, treatment
              plans, and prescriptions in a clean interface.
            </p>
          </div>

          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>History Linear</title>
                <g fill="none">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4l2.5 2.5"
                  />
                  <path
                    fill="currentColor"
                    d="m5.604 5.604l-.53-.53zM4.338 6.871l-.75.003a.75.75 0 0 0 .746.747zm2.542.762a.75.75 0 1 0 .007-1.5zM5.075 4.321a.75.75 0 1 0-1.5.008zm-1.248 6.464a.75.75 0 1 0-1.486-.204zm15.035-5.647c-3.82-3.82-9.993-3.86-13.788-.064l1.06 1.06c3.2-3.199 8.423-3.18 11.668.064zM5.138 18.862c3.82 3.82 9.993 3.86 13.788.064l-1.06-1.06c-3.2 3.199-8.423 3.18-11.668-.064zm13.788.064c3.795-3.795 3.756-9.968-.064-13.788l-1.06 1.06c3.244 3.245 3.263 8.468.064 11.668zM5.074 5.074L3.807 6.34L4.868 7.4l1.266-1.266zm-.74 2.547l2.546.012l.007-1.5l-2.545-.012zm.754-.754L5.075 4.32l-1.5.008l.013 2.545zM2.34 10.58a9.81 9.81 0 0 0 2.797 8.281l1.06-1.06a8.31 8.31 0 0 1-2.371-7.017z"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              Patient History
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Instant access to a timeline view of past visits and treatments,
              strictly filtered by doctor permissions.
            </p>
          </div>

          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Lock Keyhole Minimalistic Linear</title>
                <g fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                  <path
                    stroke-linecap="round"
                    d="M12 14v4m-6-8V8a6 6 0 1 1 12 0v2"
                  />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              RBAC Security
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Strict Role-Based Access Control ensures receptionists handle
              logistics while doctors focus on clinical data.
            </p>
          </div>

          <div className="group p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border bg-white border-slate-200 hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Shield Warning Linear</title>
                <g fill="none">
                  <path
                    stroke="currentColor"
                    stroke-width="1.5"
                    d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.5"
                    d="M12 8v4"
                  />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                </g>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-slate-900">
              Compliance &amp; Audits
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Comprehensive audit trails logging every view, edit, and login
              attempt to ensure total accountability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
