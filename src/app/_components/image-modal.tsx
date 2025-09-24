"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
  const { user } = useUser();

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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatFileSize = (url: string) => {
    // This is a placeholder - you might want to add actual file size data to your image object
    return "Size unknown";
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[90vh] min-w-[95vw] max-w-7xl overflow-hidden p-0 bg-zinc-950 border border-zinc-800/50">
          <div className="flex h-full flex-col lg:flex-row">
            {/* Image Container */}
            <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 relative group">
              {/* Close button overlay */}
              <DialogClose className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </DialogClose>

              {/* Image */}
              <div className="relative max-w-full max-h-full p-8">
                <img
                  src={image.imageUrl}
                  alt={image.imageName || image.fileName || `Image ${image.id}`}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
                
                {/* Image overlay info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium truncate">
                    {image.imageName || image.fileName}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="flex w-full flex-col lg:w-96 bg-zinc-900/50 backdrop-blur-sm border-l border-zinc-800/50">
              {/* Header */}
              <div className="border-b border-zinc-800/50 p-6 bg-zinc-900/30">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-2">
                  Image Details
                </h2>
                <p className="text-zinc-400 text-sm">
                  ID: #{image.id}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Image Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">Name</span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    <p className="text-white break-words">
                      {image.imageName || image.fileName || 'Untitled'}
                    </p>
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">Uploaded by</span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                        <span className="text-zinc-400">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-white">{uploaderInfo?.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Upload Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">Created</span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    <p className="text-white">{formatDate(image.createdAt)}</p>
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">URL</span>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    <p className="text-zinc-400 text-xs break-all font-mono">
                      {image.imageUrl}
                    </p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(image.imageUrl)}
                      className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Click to copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-zinc-800/50 p-6 bg-zinc-900/30">
                <div className="flex gap-3">
                  <Button 
                    variant="destructive" 
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 hover:text-red-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-zinc-800/30 hover:bg-zinc-700/50 border-zinc-700/50 text-zinc-300"
                    onClick={() => window.open(image.imageUrl, '_blank')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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