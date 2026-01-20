export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              New MVP Release v1.0
            </div>
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tighter leading-[1.1] text-slate-900">
              Your Clinic's
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-indigo-600 from-slate-800">
                Operating System.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
              Say goodbye to manual records. Streamline patient registration,
              scheduling, and clinical notes in one secure, role-based
              workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#demo"
                className="inline-flex justify-center items-center gap-2 bg-slate-900 text-base font-medium px-8 py-3.5 rounded-full transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 hover:bg-slate-800 text-white"
              >
                Start Free Trial
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Rocket Linear</title>
                  <path
                    fill="currentColor"
                    d="m7.58 15.008l.53-.531zm0-5.477L7.05 9zm6.867 6.846l-.53-.531zm-5.494 0l-.53.531zm2.747 1.936v.75zm8.593-7.765l.53.53zM13.427 3.7l.53.532zm-2.571 10.47a.75.75 0 1 0-1.059-1.063zm-5.283-2.64l.53-.53zM9.92 7.422a.75.75 0 0 0 .811-1.261zm-.224-1.036l.406-.63zm-2.57-1.318l.11-.742zm-4.9 2.955l.529.531zm3.113-2.727l.288.693zm-2.476 4.13l-.276.697zm.123.05l.286-.694zm1.627 1.097l.53-.53zm-.095-.093l-.522.538zM2.484 9.276l.277-.697zM12.5 18.5l-.53.53l.036.034zm5.324-5.268a.75.75 0 1 0-1.26.815zm-.224 1.035l-.63.408zm1.323 2.562l.742-.11zm-2.964 4.886l.53.532zm2.735-3.104l.692.288zm-3.945 2.964l.697-.278zm-.474-1.092l.657-.36zm-1.252-1.525l.53-.53l-.018-.018l-.018-.015zm.818.867l.59-.463zm2.034 1.974l-.53-.53zM5.75 11.708l.695.28zm14.014-1.691l-5.847 5.829l1.06 1.062l5.846-5.83zM9.483 15.846l-1.374-1.37L7.05 15.54l1.374 1.37zm-1.374-5.784l5.847-5.83l-1.059-1.062L7.05 9zm9.438-7.312h.569v-1.5h-.57zm3.703 3.123v.567h1.5v-.567zM18.116 2.75c.936 0 1.564.002 2.031.064c.446.06.633.163.755.284l1.059-1.062c-.447-.446-1.003-.626-1.615-.708c-.59-.08-1.336-.078-2.23-.078zm4.634 3.123c0-.892.002-1.636-.078-2.225c-.082-.611-.264-1.166-.711-1.612L20.9 3.098c.122.121.225.307.285.75c.062.466.064 1.09.064 2.025zM8.11 14.477c-.663-.66-1.105-1.104-1.391-1.478c-.273-.356-.331-.56-.331-.73h-1.5c0 .632.265 1.152.64 1.642c.361.472.89.997 1.522 1.628zm.314 2.431c.632.63 1.159 1.158 1.632 1.518c.491.374 1.012.637 1.644.637v-1.5c-.173 0-.378-.059-.736-.33c-.374-.286-.819-.727-1.481-1.387zm12.399-5.83c.799-.795 1.355-1.332 1.648-2.036l-1.385-.575c-.151.364-.437.667-1.322 1.55zm.427-4.638c0 1.249-.013 1.663-.164 2.027l1.385.575c.292-.704.279-1.476.279-2.602zm-7.294-2.207c.885-.883 1.19-1.168 1.555-1.319l-.572-1.386c-.705.291-1.243.846-2.042 1.642zm3.59-2.983c-1.13 0-1.902-.013-2.607.278l.572 1.386c.366-.15.784-.164 2.036-.164zm-8.75 14.973l2.06-2.053l-1.059-1.063l-2.06 2.054zm1.935-10.062l-.629-.405l-.812 1.261l.63.405zm-.629-.405c-.621-.4-1.123-.724-1.554-.956c-.442-.238-.855-.407-1.312-.474L7.017 5.81c.22.032.46.117.819.31c.368.199.814.485 1.454.897zM2.755 8.554a57 57 0 0 1 1.71-1.658a12 12 0 0 1 .73-.623c.223-.172.365-.256.432-.284l-.575-1.386c-.257.107-.527.292-.773.482c-.258.199-.54.442-.826.703c-.572.522-1.2 1.149-1.757 1.704zm4.481-4.228a4.13 4.13 0 0 0-2.184.277l.575 1.386a2.63 2.63 0 0 1 1.39-.18zM2.208 9.973l.379.15l.552-1.394l-.378-.15zm1.875 1.131l.96.958L6.104 11l-.96-.958zm-1.496-.98l.114.045l.571-1.387l-.133-.053zm2.555-.082l-.101-.1l-1.045 1.076l.087.086zm-2.441.127c.482.198.921.487 1.295.85l1.045-1.077a5.6 5.6 0 0 0-1.769-1.16zM1.696 7.492a1.514 1.514 0 0 0 .512 2.481l.553-1.394l-.007-.004l-.003-.008V8.56l.004-.006zm14.869 6.555l.406.627l1.259-.815l-.406-.627zm-1.136 7.137l-.084.084l1.06 1.062l.083-.083zm1.542-6.51c.414.64.7 1.083.9 1.45c.193.358.278.597.31.815l1.484-.22c-.068-.457-.238-.87-.476-1.31c-.233-.43-.558-.93-.959-1.55zm-.483 7.573c.557-.556 1.186-1.183 1.71-1.753c.261-.285.505-.566.705-.823c.19-.245.376-.514.483-.771l-1.384-.578a2.3 2.3 0 0 1-.285.43a12 12 0 0 1-.624.728a57 57 0 0 1-1.664 1.704zm1.693-5.308c.068.456.008.934-.18 1.383l1.385.578a4.1 4.1 0 0 0 .279-2.182zm-4.664 1.456l-.523-.459l-.988 1.128l.522.458zm1.929 2.902c-.215-.539-.344-.866-.514-1.175l-1.315.721c.116.21.208.438.435 1.01zm-2.953-1.807c.436.434.61.609.758.798l1.18-.926c-.217-.277-.467-.525-.879-.935zm2.44.632a5.6 5.6 0 0 0-.502-.76l-1.18.926q.206.262.366.555zM16.662 9a1.196 1.196 0 0 1-1.687 0l-1.059 1.062a2.696 2.696 0 0 0 3.806 0zm-1.687 0a1.18 1.18 0 0 1 0-1.677l-1.059-1.062a2.68 2.68 0 0 0 0 3.8zm0-1.677a1.196 1.196 0 0 1 1.688 0l1.059-1.062a2.696 2.696 0 0 0-3.806 0zm1.688 0a1.18 1.18 0 0 1 0 1.677l1.059 1.062a2.68 2.68 0 0 0 0-3.8zm-1.319 13.945a.1.1 0 0 1 .028-.016l.023-.001l.024.012q.018.015.026.034l-1.394.555c.384.963 1.632 1.196 2.352.478zm-1.428-5.422c-.511.51-.896.893-1.227 1.178c-.331.287-.555.426-.73.491l.518 1.408c.428-.158.814-.436 1.193-.764s.808-.755 1.305-1.25zm-1.957 1.669a.7.7 0 0 1-.26.048v1.5q.404-.001.778-.14zm1.07.455l-.28-.281l-1.062 1.06l.282.281zM7.05 9c-.485.484-.904.901-1.23 1.272c-.324.37-.601.745-.766 1.156l1.391.56c.071-.177.217-.4.503-.727c.285-.325.663-.702 1.161-1.2zm-1.996 2.428a2.2 2.2 0 0 0-.166.841h1.5c0-.09.016-.179.057-.282zm-.011.634l.176.176l1.06-1.06L6.105 11z"
                  />
                </svg>
              </a>
              <a
                href="#features"
                className="inline-flex justify-center items-center gap-2 border text-base font-medium px-8 py-3.5 rounded-full transition-all bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
              >
                View Workflow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Playback Speed</title>
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                      stroke-linecap="round"
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2"
                    />
                    <path
                      stroke-dasharray="4 3"
                      stroke-linecap="round"
                      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2"
                    />
                    <path d="M15.414 10.941c.781.462.781 1.656 0 2.118l-4.72 2.787C9.934 16.294 9 15.71 9 14.786V9.214c0-.924.934-1.507 1.694-1.059z" />
                  </g>
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60 mt-4">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&amp;fit=crop&amp;w=64&amp;h=64"
                  alt=""
                  className="w-10 h-10 rounded-full border-2 object-cover border-white grayscale"
                />
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&amp;fit=crop&amp;w=64&amp;h=64"
                  alt=""
                  className="w-10 h-10 rounded-full border-2 object-cover border-white grayscale"
                />
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&amp;fit=crop&amp;w=64&amp;h=64"
                  alt=""
                  className="w-10 h-10 rounded-full border-2 object-cover border-white grayscale"
                />
              </div>
              <div>
                <div className="flex gap-0.5 text-slate-900">
                  <span className="text-sm font-bold">
                    Trusted by 50+ Clinics
                  </span>
                </div>
                <p className="text-xs font-medium mt-0.5 text-slate-500">
                  HIPAA-ready &amp; Secure
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200/50">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="h-2 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="flex">
                <div className="w-16 md:w-20 bg-white border-r border-slate-100 py-6 flex flex-col items-center gap-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Health Bold</title>
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M8.962 18.469C6.019 16.214 2 12.489 2 8.967C2 3.083 7.5.886 12 5.43C16.5.886 22 3.083 22 8.967c0 3.522-4.02 7.247-6.962 9.502C13.706 19.489 13.04 20 12 20s-1.706-.51-3.038-1.531M16.5 6.25a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5h-1.25V11a.75.75 0 0 1-1.5 0V9.75H14.5a.75.75 0 0 1 0-1.5h1.25V7a.75.75 0 0 1 .75-.75"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Users Group</title>
                      <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="6" r="4" />
                        <path stroke-linecap="round" d="M15 9a3 3 0 1 0 0-6" />
                        <ellipse cx="9" cy="17" rx="7" ry="4" />
                        <path
                          stroke-linecap="round"
                          d="M18 14c1.754.385 3 1.359 3 2.5c0 1.03-1.014 1.923-2.5 2.37"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Calendar Linear</title>
                      <g fill="none">
                        <path
                          stroke="currentColor"
                          stroke-width="1.5"
                          d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"
                        />
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                          d="M7 4V2.5M17 4V2.5M2.5 9h19"
                        />
                        <path
                          fill="currentColor"
                          d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <title>Document Text</title>
                      <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                        <path stroke-linecap="round" d="M8 12h8M8 8h8m-8 8h5" />
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 bg-slate-50/50">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="h-2 w-16 bg-indigo-100 rounded mb-2" />
                      <div className="h-6 w-48 bg-slate-900 rounded-md" />
                    </div>
                    <div className="h-8 w-24 bg-indigo-600 rounded-full" />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                        <div>
                          <div className="h-3 w-32 bg-slate-800 rounded mb-1" />
                          <div className="h-2 w-20 bg-slate-400 rounded" />
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Checked-in
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                        <div>
                          <div className="h-3 w-28 bg-slate-800 rounded mb-1" />
                          <div className="h-2 w-24 bg-slate-400 rounded" />
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                        Scheduled
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                        <div>
                          <div className="h-3 w-32 bg-slate-800 rounded mb-1" />
                          <div className="h-2 w-16 bg-slate-400 rounded" />
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        10:30 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-12 -left-6 flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-lg bg-white/90 text-slate-800 border border-white/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Shield Check</title>
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m9.5 12.4l1.429 1.6l3.571-4"
                    />
                  </g>
                </svg>
                Role-Based Access
              </span>
            </div>
            <div className="absolute bottom-12 -right-6 flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-lg bg-white/90 text-slate-800 border border-white/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Stopwatch</title>
                  <g fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 13a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 13V9"
                    />
                    <path stroke-linecap="round" d="M10 2h4" />
                  </g>
                </svg>
                &lt; 2 min Booking
              </span>
            </div>

            <div className="absolute -z-10 top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl bg-indigo-300/20" />
          </div>
        </div>
      </div>
    </section>
  );
};
