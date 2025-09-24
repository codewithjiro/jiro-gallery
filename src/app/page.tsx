import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";

export const dynamic = "force-dynamic"; // This page is dynamic and should not be cached

async function Images() {
  const images = await getMyImages();

  return (
    <div>
      <div className="flex justify-end p-4">
        <UploadDialog />
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {images.map((image) => (
          <div key={image.id} className="flex w-64 flex-col">
            <ImageModal image={image}>
              <div className="relative aspect-video bg-zinc-900">
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.id}`}
                  className="h-full w-full object-contain object-top"
                />
              </div>
            </ImageModal>
            <div className="text-center">
              {image.imageName || image.fileName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main>
      {/* If signed out → show Sign In screen */}
      <SignedOut>
        <div className="flex h-screen flex-col items-center justify-center gap-6">
          <p className="text-2xl">Please sign in to continue</p>
          <SignIn afterSignInUrl="/" />
        </div>
      </SignedOut>

      {/* If signed in → show app */}
      <SignedIn>
        <div className="h-full w-full text-center text-2xl">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
