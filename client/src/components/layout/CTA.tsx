export const CTA = () => {
  return (
    <section
      id="demo"
      className="py-24 rounded-t-[3rem] lg:rounded-t-[4rem] overflow-hidden relative bg-slate-900 text-white"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative hidden lg:block">
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative z-10 p-10 border border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-3xl">
              <h3 className="text-2xl font-semibold mb-6">Why ClinicCore?</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Bolt Linear</title>
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        d="m5.67 9.914l3.062-4.143c1.979-2.678 2.969-4.017 3.892-3.734s.923 1.925.923 5.21v.31c0 1.185 0 1.777.379 2.148l.02.02c.387.363 1.003.363 2.236.363c2.22 0 3.329 0 3.704.673l.018.034c.354.683-.289 1.553-1.574 3.29l-3.062 4.144c-1.98 2.678-2.969 4.017-3.892 3.734s-.923-1.925-.923-5.21v-.31c0-1.185 0-1.777-.379-2.148l-.02-.02c-.387-.363-1.003-.363-2.236-.363c-2.22 0-3.329 0-3.703-.673l-.019-.034c-.354-.683.289-1.552 1.574-3.29Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Rapid Deployment</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Get your clinic running digitally in less than 48 hours.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Diploma Verified Linear</title>
                      <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M7 17.998c-2.175-.012-3.353-.108-4.121-.877C2 16.243 2 14.828 2 12V8c0-2.828 0-4.243.879-5.121C3.757 2 5.172 2 8 2h8c2.828 0 4.243 0 5.121.879C22 3.757 22 5.172 22 8v4c0 2.828 0 4.243-.879 5.121c-.73.73-1.829.854-3.801.875l-.82.002" />
                        <path stroke-linecap="round" d="M9 6h6M7 9.5h10" />
                        <path d="M10.89 13.945a1.71 1.71 0 0 1 2.22 0c.273.234.614.375.972.404a1.71 1.71 0 0 1 1.57 1.568c.028.36.169.7.402.974a1.71 1.71 0 0 1 0 2.218a1.7 1.7 0 0 0-.403.974a1.71 1.71 0 0 1-1.569 1.569a1.7 1.7 0 0 0-.973.403a1.71 1.71 0 0 1-2.219 0a1.7 1.7 0 0 0-.973-.404a1.71 1.71 0 0 1-1.569-1.568a1.7 1.7 0 0 0-.403-.974a1.71 1.71 0 0 1 0-2.218a1.7 1.7 0 0 0 .403-.974a1.71 1.71 0 0 1 1.57-1.568c.358-.029.699-.17.973-.404Z" />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m10.5 18.2l.857.8l2.143-2"
                        />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Minimal Training</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Intuitive UI means your staff needs minutes, not days, to
                      learn.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Tag Price Linear</title>
                      <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4.728 16.137c-1.545-1.546-2.318-2.318-2.605-3.321c-.288-1.003-.042-2.068.45-4.197l.283-1.228c.413-1.792.62-2.688 1.233-3.302s1.51-.82 3.302-1.233l1.228-.284c2.13-.491 3.194-.737 4.197-.45c1.003.288 1.775 1.061 3.32 2.606l1.83 1.83C20.657 9.248 22 10.592 22 12.262c0 1.671-1.344 3.015-4.033 5.704c-2.69 2.69-4.034 4.034-5.705 4.034c-1.67 0-3.015-1.344-5.704-4.033z" />
                        <path
                          stroke-linecap="round"
                          d="M15.39 15.39c.585-.587.664-1.457.176-1.946s-1.359-.409-1.945.177c-.585.586-1.456.665-1.944.177s-.409-1.359.177-1.944m3.535 3.535l.354.354m-.354-.354c-.4.401-.935.565-1.389.471m-2.5-4.36l.354.354m0 0c.331-.332.753-.5 1.146-.497"
                        />
                        <circle
                          cx="8.607"
                          cy="8.879"
                          r="2"
                          transform="rotate(-45 8.607 8.879)"
                        />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Cost Effective</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Designed for small practices with budget-friendly scaling.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Deploy Your Digital Clinic.
            </h2>
            <p className="font-medium mb-10 text-lg text-slate-400">
              Schedule a personalized demo of the MVP. See how ClinicCore
              transforms your workflow.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    placeholder="Full Name"
                    className="w-full border rounded-xl px-5 py-4 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Work Email"
                    className="w-full border rounded-xl px-5 py-4 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clinic-name" className="sr-only">
                    Clinic Name
                  </label>
                  <input
                    id="clinic-name"
                    type="text"
                    placeholder="Clinic Name"
                    className="w-full border rounded-xl px-5 py-4 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="relative">
                  <select className="w-full border rounded-xl px-5 py-4 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer bg-slate-800/50 border-slate-700 text-white">
                    <option className="text-slate-900">
                      Number of Doctors
                    </option>
                    <option className="text-slate-900">
                      1 (Solo Practice)
                    </option>
                    <option className="text-slate-900">2-5</option>
                    <option className="text-slate-900">5+</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <title>Alt Arrow Down Lineara</title>
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
              </div>

              <button
                type="button"
                className="w-full bg-indigo-600 font-semibold text-lg py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 mt-4 hover:bg-indigo-500 text-white"
              >
                Request Access
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Arrow Right Linear</title>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  />
                </svg>
              </button>
              <p className="text-xs text-center text-slate-500 mt-4">
                By clicking Request Access, you agree to our Terms &amp; Privacy
                Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
