import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema({
  Title: String,
  Artist: [String],
  ConstituentID: [Number],
  ArtistBio: [String],
  Nationality: [String],
  BeginDate: [Number],
  EndDate: [Number],
  Gender: [String],
  Date: String,
  Medium: String,
  Dimensions: String,
  CreditLine: String,
  AccessionNumber: String,
  Classification: String,
  Department: String,
  DateAcquired: String,
  Cataloged: String,
  ObjectID: { type: Number, unique: true },
  URL: String,
  ImageURL: String,
  OnView: String,
  "Height (cm)": Number,
  "Width (cm)": Number,
});

// If the model already exists (due to hot reload), use it. Otherwise create it.
const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

export default Artwork;
