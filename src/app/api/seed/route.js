import { promises as fs } from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Artwork from "@/lib/Artwork";

// GET /api/seed — Load Artworks.json into MongoDB
export async function GET() {
  await connectDB();

  // Check if database already has data
  const count = await Artwork.countDocuments();
  if (count > 0) {
    return Response.json({
      message: `Database already seeded with ${count} artworks. Skipping.`,
    });
  }

  // Read the JSON file from the data folder
  const filePath = path.join(process.cwd(), "data", "Artworks.json");
  const fileData = await fs.readFile(filePath, "utf-8");
  const artworks = JSON.parse(fileData);

  const subset = artworks.slice(0, 10000);

  // Insert all artworks into MongoDB in one go
  // insertMany is much faster than saving one at a time
  await Artwork.insertMany(subset);

  return Response.json({
    message: `Successfully seeded ${subset.length} artworks into the database.`,
  });
}
