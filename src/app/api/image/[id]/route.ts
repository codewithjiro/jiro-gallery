import { db } from "~/server/db"; 
import { images } from "~/server/db/schema"; 
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const imageId = parseInt(params.id);
  if (isNaN(imageId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await db.delete(images).where(eq(images.id, imageId));
    return NextResponse.json({ success: true });
  } catch (err) {
    toast.error("Failed to delete image.");
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
