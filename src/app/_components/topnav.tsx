import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function TopNav() {
  return (
    <nav className="flex h-12 w-full items-center justify-between border-b border-white/10 bg-black px-4 font-semibold">
      <div>IPT315</div>
      <div className="flex items-center gap-4 p-4">
        <SignedOut>
          <SignInButton>LOGIN</SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
