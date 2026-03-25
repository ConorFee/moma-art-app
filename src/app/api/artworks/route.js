import connectDB from "@/lib/mongodb";
import Artwork from "@/lib/Artwork";

// GET /api/artworks — Fetch artworks (with optional search)
// Same idea as your lab's: app.get('/users', async (req, res) => { ... })
export async function GET(request) {
  await connectDB();

  // Read query parameters from the URL (e.g. /api/artworks?page=2&search=picasso)
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;
  const search = searchParams.get("search") || "";

  // Build a filter — if the user searched for something, look in Title and Artist
  let filter = {};
  if (search) {
    filter = {
      $or: [
        { Title: { $regex: search, $options: "i" } },
        { Artist: { $regex: search, $options: "i" } },
      ],
    };
  }

  // Get total count (for pagination info)
  const total = await Artwork.countDocuments(filter);

  // Fetch the artworks for this page
  // .skip() jumps past previous pages, .limit() caps how many we return
  const artworks = await Artwork.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  return Response.json({
    artworks,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/artworks — Add a new artwork
// Same idea as your lab's: app.post('/users', async (req, res) => { ... })
export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const artwork = new Artwork(body);
  await artwork.save();

  return Response.json(
    { message: "Artwork created", artwork },
    { status: 201 }
  );
}
