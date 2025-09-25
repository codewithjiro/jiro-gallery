"use client";
import { useUser } from "@clerk/nextjs";
import {
  ClipboardCopy,
  X,
  Info,
  Calendar,
  User,
  Link,
  Trash2,
  ExternalLink,
  ChevronUp,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

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
  const [imageLoaded, setImageLoaded] = useState(false);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
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
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Error deleting image");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.imageUrl);
    toast.success("URL copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = image.imageName || image.fileName || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="sr-only">
          {image.imageName || image.fileName || `Image ${image.id}`}
        </DialogTitle>

        <DialogContent className="h-screen w-screen max-w-none border-0 bg-black/95 p-0 sm:h-[95vh] sm:w-[95vw] sm:max-w-6xl sm:rounded-xl sm:border">
          {/* Mobile Header */}
          <div className="flex h-14 items-center justify-between border-b border-white/10 bg-black/50 px-4 backdrop-blur-md sm:hidden">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-8 w-8 rounded-full bg-white/10 p-0 text-white hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
              </Button>
              <div className="max-w-[180px]">
                <p className="truncate text-sm font-medium text-white">
                  {image.imageName || image.fileName || "Untitled"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex h-full min-h-0 flex-col sm:flex-row">
            {/* Image Container */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
              {/* Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                </div>
              )}

              {/* Image */}
              <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
                <img
                  src={image.imageUrl}
                  alt={image.imageName || image.fileName || `Image ${image.id}`}
                  className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>

              {/* Desktop Image Info Overlay */}
              <div className="absolute right-4 bottom-4 left-4 hidden rounded-lg bg-black/60 p-3 backdrop-blur-md transition-all duration-300 sm:block sm:opacity-0 sm:hover:opacity-100">
                <p className="truncate text-sm font-medium text-white">
                  {image.imageName || image.fileName}
                </p>
                <p className="text-xs text-white/70">
                  {formatDate(image.createdAt)}
                </p>
              </div>
            </div>

            {/* Mobile Details Panel - Slide Up */}
            <div
              className={`absolute inset-x-0 bottom-0 transform transition-transform duration-300 ease-out sm:hidden ${
                showDetails ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="rounded-t-3xl bg-white/10 backdrop-blur-md">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="h-1 w-12 rounded-full bg-white/30"></div>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Image Details
                  </h3>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-white/70">
                        <Info className="h-4 w-4" />
                        <span className="text-sm font-medium">Name</span>
                      </div>
                      <p className="text-white">
                        {image.imageName || image.fileName || "Untitled"}
                      </p>
                    </div>

                    {/* Uploader */}
                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-white/70">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Uploaded by</span>
                      </div>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                          <span className="text-white/70">Loading...</span>
                        </div>
                      ) : (
                        <p className="text-white">{uploaderInfo?.fullName}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-white/70">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Created</span>
                      </div>
                      <p className="text-white">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>

                    {/* URL */}
                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-white/70">
                        <Link className="h-4 w-4" />
                        <span className="text-sm font-medium">URL</span>
                      </div>
                      <button
                        onClick={handleCopyUrl}
                        className="w-full rounded-lg bg-white/10 p-3 text-left transition-colors hover:bg-white/20"
                      >
                        <p className="mb-1 truncate font-mono text-xs text-white/80">
                          {image.imageUrl}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <ClipboardCopy className="h-3 w-3" />
                          Tap to copy
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="rounded-xl border border-red-500/30 bg-red-500/20 text-white hover:bg-red-500/30"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(image.imageUrl, "_blank")}
                      className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Details Panel */}
            <div className="hidden w-80 border-l border-white/10 bg-black/50 backdrop-blur-md sm:flex sm:flex-col">
              {/* Header */}
              <div className="border-b border-white/10 p-6">
                <h2 className="text-xl font-bold text-white">Image Details</h2>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-white/70">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Name</span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="break-words text-white">
                        {image.imageName || image.fileName || "Untitled"}
                      </p>
                    </div>
                  </div>

                  {/* Uploader */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-white/70">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Uploaded by</span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                          <span className="text-white/70">Loading...</span>
                        </div>
                      ) : (
                        <p className="text-white">{uploaderInfo?.fullName}</p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-white/70">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Uploaded at</span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-white">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-white/70">
                      <Link className="h-4 w-4" />
                      <span className="text-sm font-medium">URL</span>
                    </div>
                    <button
                      onClick={handleCopyUrl}
                      className="w-full rounded-xl bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
                    >
                      <p className="mb-2 font-mono text-xs break-all text-white/80">
                        {image.imageUrl}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <ClipboardCopy className="h-3 w-3" />
                        Click to copy
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Actions Footer */}
              <div className="border-t border-white/10 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="rounded-xl border border-red-500/30 bg-red-500/20 text-white hover:bg-red-500/30"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(image.imageUrl, "_blank")}
                    className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="mt-3 w-full rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
