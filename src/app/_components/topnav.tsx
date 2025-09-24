import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-900/80 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-lg shadow-purple-500/20">
              <span className="text-lg font-bold text-white">IT</span>
            </div>
            <div className="flex flex-col">
              <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-2xl font-bold text-transparent">
                IT315
              </h1>
              <p className="-mt-1 text-xs text-zinc-500">Gallery App</p>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="group">
                <SignInButton>
                  <button className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/40 active:scale-95">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                {/* User Button with enhanced styling */}
                <div className="relative">
                  <div>
                    <div className="rounded-full bg-zinc-900 p-0.5">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox:
                              "w-9 h-9 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200",
                            userButtonPopoverCard:
                              "bg-zinc-900 border border-zinc-800",
                            userButtonPopoverActionButton: "hover:bg-zinc-800",
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Online indicator */}
                  <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500 shadow-lg">
                    <div className="h-full w-full animate-pulse rounded-full bg-green-400" />
                  </div>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
    </nav>
  );
}
