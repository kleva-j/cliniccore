import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (sectionId: string) => {
    document.querySelector(sectionId)?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menu.current &&
        !menu.current.contains(event.target as Node) &&
        menuButton.current &&
        !menuButton.current.contains(event.target as Node)
      )
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 md:p-6">
      <nav className="mx-auto max-w-7xl rounded-full backdrop-blur-xl border shadow-sm px-6 py-3 flex items-center justify-between transition-all duration-300 bg-white/80 border-slate-200/60">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-slate-800 transition-colors text-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Health Icon</title>
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
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Cliniccore
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900"
          >
            Workflow
          </a>
          <a
            href="#security"
            className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900"
          >
            Security
          </a>
          <a
            href="#faq"
            className="text-sm font-medium transition-colors text-slate-600 hover:text-slate-900"
          >
            FAQ
          </a>
        </div>

        <a
          href="#demo"
          className="hidden md:inline-flex items-center gap-2 bg-slate-900 text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 hover:bg-slate-800 text-white"
        >
          Request Demo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <title>Arrow Right</title>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 12h16m0 0l-6-6m6 6l-6 6"
            />
          </svg>
        </a>

        <button
          className="md:hidden text-slate-900 flex items-center"
          type="button"
          ref={menuButton}
          id="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
        >
          {!isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Hamburger Menu</title>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M20 7H4m16 5H4m16 5H4"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Close Circle</title>
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <path stroke-linecap="round" d="m14.5 9.5l-5 5m0-5l5 5" />
              </g>
            </svg>
          )}
        </button>
      </nav>
      <div
        id="mobile-menu"
        ref={menu}
        className={`${isMenuOpen ? "block" : "hidden"} absolute left-4 right-4 top-[calc(100%-1rem)] mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl transition-all md:hidden`}
      >
        <div className="flex flex-col space-y-1">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              scrollToSection("#features");
              closeMenu();
            }}
            className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Features
          </button>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              scrollToSection("#workflow");
              closeMenu();
            }}
            className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Workflow
          </button>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              scrollToSection("#security");
              closeMenu();
            }}
            className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Security
          </button>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              scrollToSection("#faq");
              closeMenu();
            }}
            className="w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            FAQ
          </button>
        </div>
        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              scrollToSection("#demo");
              closeMenu();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800"
          >
            Request Demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Arrow Right</title>
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
        </div>
      </div>
    </header>
  );
};
