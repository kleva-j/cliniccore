export const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t bg-white border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <a href="#home" className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg text-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Health Linear</title>
                  <g fill="none">
                    <path
                      fill="currentColor"
                      d="m8.962 19.379l-.473.582zM12 5.574l-.548.512a.75.75 0 0 0 1.096 0zm3.038 13.805l.473.582zM12 21v-.75zm-2.566-2.204c-1.45-1.176-3.142-2.719-4.466-4.408c-1.339-1.707-2.218-3.46-2.218-5.07h-1.5c0 2.117 1.13 4.202 2.537 5.996c1.422 1.813 3.21 3.436 4.702 4.647zM2.75 9.318c0-2.905 1.268-4.7 2.836-5.315c1.565-.613 3.754-.175 5.866 2.083l1.096-1.024c-2.388-2.554-5.199-3.36-7.509-2.456C2.732 3.51 1.25 5.992 1.25 9.318zM15.51 19.96c1.493-1.211 3.281-2.834 4.703-4.647c1.407-1.794 2.537-3.879 2.537-5.997h-1.5c0 1.612-.88 3.364-2.218 5.071c-1.324 1.689-3.016 3.232-4.466 4.408zm7.24-10.644c0-3.325-1.482-5.807-3.79-6.71c-2.31-.905-5.12-.1-7.508 2.455l1.096 1.024c2.112-2.258 4.301-2.696 5.866-2.083c1.568.614 2.836 2.41 2.836 5.314zM8.49 19.961c1.27 1.032 2.152 1.789 3.51 1.789v-1.5c-.723 0-1.173-.324-2.566-1.454zm6.076-1.165c-1.393 1.13-1.843 1.454-2.566 1.454v1.5c1.358 0 2.24-.757 3.51-1.789z"
                    />
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="1.5"
                      d="M18.5 9h-2m0 0h-2m2 0V7m0 2v2"
                    />
                  </g>
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900">
                Cliniccore
              </span>
            </a>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Simplicity, Security, and Speed for the modern independent clinic.
            </p>
            <div className="flex gap-4">
              <a
                href="#twitter"
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 transition-all bg-white border-slate-200 text-slate-500 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Twitter X line</title>
                  <path
                    fill="currentColor"
                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                  />
                </svg>
              </a>
              <a
                href="#linkedin"
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 transition-all bg-white border-slate-200 text-slate-500 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Linkedin Fill</title>
                  <path
                    fill="currentColor"
                    d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"
                  />
                </svg>
              </a>
              <a
                href="#github"
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 transition-all bg-white border-slate-200 text-slate-500 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Github fill</title>
                  <path
                    fill="currentColor"
                    d="M12.001 2c-5.525 0-10 4.475-10 10a9.99 9.99 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.687c-.1-.25-.45-1.275.1-2.65c0 0 .837-.263 2.75 1.024a9.3 9.3 0 0 1 2.5-.337c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.02 10.02 0 0 0 22 12c0-5.525-4.475-10-10-10"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li>
                <a
                  href="#Features"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#Security"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#Pricing"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#Roadmap"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li>
                <a
                  href="#About"
                  className="hover:text-indigo-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#Contact"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#Blog"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li>
                <a
                  href="#PrivacyPolicy"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#TOS"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#BAA"
                  className="hover:text-indigo-600 transition-colors"
                >
                  BAA Agreement
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-slate-100">
          <p className="text-slate-400 font-medium text-xs">
            © 2024 Cliniccore Inc. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-500">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
