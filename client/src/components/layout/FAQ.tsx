export const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900">
            Common
            <span className="text-indigo-600">Questions</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Understanding the ClinicCore MVP.
          </p>
        </div>
        <div className="space-y-4">
          <details className="group rounded-2xl shadow-sm [&amp;_summary::-webkit-details-marker]:hidden open:ring-1 open:ring-indigo-500/20 bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
              <h2 className="text-base font-semibold">
                Is ClinicCore suitable for large hospitals?
              </h2>
              <div className="rounded-full p-1.5 text-indigo-500 transition duration-300 group-open:-rotate-180 bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Alt Arrow Down Linear</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m19 9l-7 6l-7-6"
                  />
                </svg>
              </div>
            </summary>
            <p className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
              ClinicCore is specifically designed as an MVP for small clinics
              and outpatient departments (1-5 doctors). It avoids the bloat of
              enterprise hospital software to ensure speed and simplicity.
            </p>
          </details>

          <details className="group rounded-2xl shadow-sm [&amp;_summary::-webkit-details-marker]:hidden open:ring-1 open:ring-indigo-500/20 bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
              <h2 className="text-base font-semibold">
                Is patient data secure?
              </h2>
              <div className="rounded-full p-1.5 text-indigo-500 transition duration-300 group-open:-rotate-180 bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Alt Arrow Down Linear</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m19 9l-7 6l-7-6"
                  />
                </svg>
              </div>
            </summary>
            <p className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
              Yes. We use AES-256 encryption for data at rest and HTTPS for
              transit. Our role-based access control (RBAC) ensures staff only
              see what they need to see.
            </p>
          </details>

          <details className="group rounded-2xl shadow-sm [&amp;_summary::-webkit-details-marker]:hidden open:ring-1 open:ring-indigo-500/20 bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
              <h2 className="text-base font-semibold">
                Do I need to install software?
              </h2>
              <div className="rounded-full p-1.5 text-indigo-500 transition duration-300 group-open:-rotate-180 bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Alt Arrow Down Linear</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m19 9l-7 6l-7-6"
                  />
                </svg>
              </div>
            </summary>
            <p className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
              No. ClinicCore is cloud-based. You can access it from any secure
              web browser on a computer or tablet.
            </p>
          </details>

          <details className="group rounded-2xl shadow-sm [&amp;_summary::-webkit-details-marker]:hidden open:ring-1 open:ring-indigo-500/20 bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
              <h2 className="text-base font-semibold">
                Can I migrate my existing patient data?
              </h2>
              <div className="rounded-full p-1.5 text-indigo-500 transition duration-300 group-open:-rotate-180 bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Alt Arrow Down Linear</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m19 9l-7 6l-7-6"
                  />
                </svg>
              </div>
            </summary>
            <p className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
              Admins have access to a bulk import tool to bring in doctors and
              initial user data. Patient data migration services are available
              for the setup phase.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};
