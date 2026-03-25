import connectDB from "@/lib/mongodb";
import Artwork from "@/lib/Artwork";

// GET /api/artworks/[id] — Fetch a single artwork
export async function GET(request, { params }) {
  await connectDB();

  const { id } = await params;
  const artwork = await Artwork.findById(id);

  if (!artwork) {
    return Response.json({ error: "Artwork not found" }, { status: 404 });
  }

  return Response.json(artwork);
}

// PUT /api/artworks/[id] — Update an artwork
// Your lab didn't have an update route, but it follows the same pattern
export async function PUT(request, { params }) {
  await connectDB();

  const { id } = await params;
  const body = await request.json();

  // findByIdAndUpdate finds the artwork, applies changes, returns the updated version
  const artwork = await Artwork.findByIdAndUpdate(id, body, { new: true });

  if (!artwork) {
    return Response.json({ error: "Artwork not found" }, { status: 404 });
  }

  return Response.json({ message: "Artwork updated", artwork });
}

// DELETE /api/artworks/[id] — Delete an artwork
// Same idea as your lab's: app.delete('/users/:id', async (req, res) => { ... })
export async function DELETE(request, { params }) {
  await connectDB();

  const { id } = await params;
  const artwork = await Artwork.findByIdAndDelete(id);

  if (!artwork) {
    return Response.json({ error: "Artwork not found" }, { status: 404 });
  }

  return Response.json({ message: "Artwork deleted" });
}
