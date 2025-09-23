import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  // const mockUrls = [
  //   "https://billboardphilippines.com/wp-content/uploads/2024/12/bini-digital-in-article-09.jpg",
  // ];

  // const images = mockUrls.map((url, index) => ({
  //   id: index + 1,
  //   url,
  // }));

  const images = await getMyImages();

  return (
    <div>
      <div className="flex justify-center p-6">
        <UploadDialog />
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={image.imageUrl}
              alt={`Image ${image.id}`}
              className="h-64 w-80 object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in to access the application.
        </div>
      </SignedOut>
      <SignedIn>
        <div className="mt-8 h-full w-full text-center text-2xl font-semibold">
          Welcome to the application!
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
