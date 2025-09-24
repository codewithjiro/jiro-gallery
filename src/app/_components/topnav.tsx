import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800/50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                IT315
              </h1>
              <p className="text-xs text-zinc-500 -mt-1">Gallery App</p>
            </div>
          </div>

          {/* Navigation Links (Optional - you can add these later) */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Gallery
            </a>
            <a 
              href="#" 
              className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              About
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="group">
                <SignInButton>
                  <button className="relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center gap-4">
                {/* Upload Button - Optional quick action */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg text-zinc-300 hover:text-white transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Upload</span>
                </button>

                {/* User Button with enhanced styling */}
                <div className="relative">
                  <div className="p-0.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
                    <div className="bg-zinc-900 rounded-full p-0.5">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9 rounded-full ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200",
                            userButtonPopoverCard: "bg-zinc-900 border border-zinc-800",
                            userButtonPopoverActionButton: "hover:bg-zinc-800",
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900 shadow-lg">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
    </nav>
  );
}