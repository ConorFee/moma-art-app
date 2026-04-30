import connectDB from "@/lib/mongodb";
import Artwork from "@/lib/Artwork";

// GET /api/artworks — Fetch artworks (with optional search, filter, sort)
export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;
  const search = searchParams.get("search") || "";
  const classification = searchParams.get("classification") || "";
  const department = searchParams.get("department") || "";
  const sortBy = searchParams.get("sortBy") || "Title";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

  // Start with an array of conditions we'll combine with $and
  const conditions = [];

  if (search) {
    conditions.push({
      $or: [
        { Title: { $regex: search, $options: "i" } },
        { Artist: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (classification) {
    conditions.push({ Classification: { $regex: `^${classification}$`, $options: "i" } });
  }

  if (department) {
    conditions.push({ Department: { $regex: `^${department}$`, $options: "i" } });
  }

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const total = await Artwork.countDocuments(filter);

  const artworks = await Artwork.find(filter)
    .sort({ [sortBy]: sortOrder })
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
