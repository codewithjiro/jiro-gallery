"use client";

import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { Input } from "~/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useUploadThing } from "~/utils/uploadthing";

const formSchema = z.object({
  imageName: z
    .string()
    .min(5, { message: "Image Name must be at least 5 characters long" })
    .max(50),
});

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageName: "",
    },
  });

  const resetForm = () => {
    setSelectedImageName(null);
    setSelectedImageUrl(null);
    form.reset();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null,
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name);
      setSelectedImageUrl(URL.createObjectURL(file));
      // Auto-populate form with filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      form.setValue("imageName", nameWithoutExt);
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      toast.error("Please select a valid image file.");
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Uploading your image...</span>
        </div>,
        {
          duration: 100000,
          id: "upload-begin",
        },
      );
    },
    onUploadError: (error) => {
      toast.dismiss("upload-begin");
      toast.error(`Upload failed: ${error.message}`);
      resetForm();
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Upload completed successfully!</span>
        </div>
      );
      resetForm();
      router.refresh();
      setOpen(false);
    },
  });

  const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length) {
      toast.warning("Please select an image first!");
      return;
    }
    const selectedImage = Array.from(inputRef.current.files);
    await startUpload(selectedImage, {
      imageName: form.getValues("imageName"),
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedImageName) {
      toast.error("Please select an image first!");
      return;
    }
    await handleImageUpload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Image</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Upload Image</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select an image to upload to your gallery. Drag & drop or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          {selectedImageUrl && (
            <div className="relative group">
              <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted">
                <img
                  src={selectedImageUrl}
                  alt={selectedImageName || "Selected Image"}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedImageName(null);
                      setSelectedImageUrl(null);
                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                      form.setValue("imageName", "");
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {selectedImageName}
              </p>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all duration-200 ${
              dragActive
                ? "border-primary bg-primary/5"
                : selectedImageUrl
                ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              ref={inputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            
            <div className="text-center space-y-4">
              {selectedImageUrl ? (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="h-6 w-6" />
                  <span className="font-medium">Image selected</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drop your image here, or{" "}
                      <span className="text-primary underline">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Image Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive name..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-3 sm:gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isUploading || !selectedImageName}
                  className="flex-1 sm:flex-none gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}