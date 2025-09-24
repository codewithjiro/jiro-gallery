"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface ImageModalProps {
  image: {
    id: number;
    fileName: string | null;
    imageName: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
  };
  children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && !uploaderInfo) {
      setIsLoading(true);
      fetch(`/api/user/${image.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setUploaderInfo({ fullName: data.fullName });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching uploader info:", error);
          setUploaderInfo({ fullName: "Unknown" });
          setIsLoading(false);
        });
    }
  }, [isOpen, uploaderInfo, image.userId]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatFileSize = (url: string) => {
    // This is a placeholder - you might want to add actual file size data to your image object
    return "Size unknown";
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/image/${image.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete image");
      }

      toast.success("Image deleted successfully");

      // Optional: close modal or refresh images list
      setIsOpen(false);
      router.refresh();
      // You might want to refetch your image list here if you're displaying it somewhere
    } catch (err) {
      toast.error("Error deleting image");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.imageUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[100dvh] w-full max-w-none border-0 bg-zinc-950 p-0 sm:h-[90vh] sm:w-[95vw] sm:max-w-7xl sm:rounded-lg sm:border sm:border-zinc-800/50">
          {/* Mobile Header - Only visible on mobile */}
          <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/30 p-4 sm:hidden">
            <h2 className="text-lg font-semibold text-white">Image Details</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-zinc-400 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex h-full flex-col sm:flex-row min-h-0">
            {/* Image Container */}
            <div className="group relative flex flex-1 items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 overflow-hidden min-h-0 min-w-0">
            

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 min-h-0 min-w-0">
                <img
                  src={image.imageUrl}
                  alt={image.imageName || image.fileName || `Image ${image.id}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl block"
                />

                {/* Image overlay info - hidden on mobile when details panel is open */}
                <div className={`absolute right-2 bottom-2 left-2 sm:right-4 sm:bottom-4 sm:left-4 rounded-lg bg-black/60 p-2 sm:p-3 backdrop-blur-sm transition-all duration-300 ${showDetails ? 'opacity-0 sm:opacity-0 sm:group-hover:opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}>
                  <p className="truncate text-xs sm:text-sm font-medium text-white">
                    {image.imageName || image.fileName}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Panel - Responsive behavior */}
            <div className={`${showDetails ? 'flex' : 'hidden'} sm:flex w-full flex-col border-t sm:border-t-0 sm:border-l border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm sm:w-96 sm:flex-shrink-0 sm:min-w-0 absolute bottom-0 left-0 right-0 h-auto max-h-[50vh] sm:relative sm:h-full sm:max-h-full overflow-hidden`}>
              {/* Header - Hidden on mobile (shown in mobile header instead) */}
              <div className="hidden sm:block border-b border-zinc-800/50 bg-zinc-900/30 p-6">
                <h2 className="mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-xl font-bold text-transparent">
                  Image Details
                </h2>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto p-4 sm:p-6">
                {/* Image Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">
                      Name
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-3">
                    <p className="break-words text-sm sm:text-base text-white">
                      {image.imageName || image.fileName || "Untitled"}
                    </p>
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
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
                    <span className="text-sm font-medium text-zinc-300">
                      Uploaded by
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-3">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white flex-shrink-0"></div>
                        <span className="text-zinc-400 text-sm">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-white">{uploaderInfo?.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Upload Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">
                      Created
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-3">
                    <p className="text-sm sm:text-base text-white">{formatDate(image.createdAt)}</p>
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">
                      URL
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-3">
                    <p className="font-mono text-xs break-all text-zinc-400 mb-2">
                      {image.imageUrl}
                    </p>
                    <button
                      onClick={handleCopyUrl}
                      className="text-xs text-zinc-500 transition-colors hover:text-zinc-300 active:text-white"
                    >
                      Click to copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="destructive"
                    className="flex-1 border border-red-500/30 bg-red-600/20 text-white hover:bg-red-600/30 hover:text-red-200 active:bg-red-600/40"
                    onClick={handleDelete}
                  >
                    <svg
                      className="mr-2 h-4 w-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-700/50 bg-zinc-800/30 text-zinc-300 hover:bg-zinc-700/50 active:bg-zinc-700/70"
                    onClick={() => window.open(image.imageUrl, "_blank")}
                  >
                    <svg
                      className="mr-2 h-4 w-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}