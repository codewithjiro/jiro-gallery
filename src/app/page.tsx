import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // This page is dynamic and should not be cached

async function Images() {
  const user = await currentUser();
  const images = await getMyImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header Section */}
      <div className="sticky top-0 z-10 border-b border-zinc-700/50 bg-zinc-900/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-3xl font-bold text-transparent">
                Welcome, {user?.firstName || "User"}!
              </h1>
              <p className="mt-1 text-zinc-400">
                {images.length} {images.length === 1 ? "image" : "images"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <UploadDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800/50">
              <svg
                className="h-10 w-10 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-300">
              No images yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-zinc-500">
              Upload your first image to get started with your beautiful gallery
            </p>
            <UploadDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ImageModal image={image}>
                  <div className="relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/50 hover:border-zinc-600/50">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={`${image.imageName}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <h3 className="truncate text-sm font-medium text-zinc-200">
                        {image.imageName || image.fileName}
                      </h3>
                    </div>
                  </div>
                </ImageModal>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800/50">
              <svg
                className="h-8 w-8 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-3xl font-bold text-transparent">
              Welcome to Gallery
            </h2>
            <p className="mb-8 leading-relaxed text-zinc-400">
              Please sign in to access your personal image gallery and start
              uploading your favorite memories.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure authentication required
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
