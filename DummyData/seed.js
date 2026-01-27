import fs from "fs";
import mongoose from "mongoose";

// 🔧 CONFIG
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/BookMyShow";
const MOVIES_FILE = process.env.MOVIES_FILE || "./BookMyShow.movies.json";
const THEATRES_FILE = process.env.THEATRES_FILE || "./BookMyShow.theatres.json";

const MIN_MOVIES = process.env.MIN_MOVIES || 3;
const MAX_MOVIES = process.env.MAX_MOVIES || 6;

// ---------- HELPERS ----------

// Convert { "$oid": "..." } → ObjectId
const toObjectId = (oidObj) => new mongoose.Types.ObjectId(oidObj.$oid);

// Pick N random unique items from array
function getRandomSubset(arr, count) {
  if (count > arr.length) count = arr.length;
  return arr
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

// ---------- MAIN ----------
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1️⃣ Read JSON files
    const moviesRaw = JSON.parse(fs.readFileSync(MOVIES_FILE, "utf-8"));
    const theatresRaw = JSON.parse(fs.readFileSync(THEATRES_FILE, "utf-8"));

    if (!moviesRaw.length || !theatresRaw.length) {
      throw new Error("Movies or theatres JSON is empty");
    }

    // 2️⃣ Extract movie ObjectIds
    const movieIds = moviesRaw.map((m) => toObjectId(m._id));

    if (movieIds.length < MIN_MOVIES) {
      throw new Error("Not enough movies to assign");
    }

    // 3️⃣ Update theatres with random movie assignments
    console.log(`📽️ Assigning movies to ${theatresRaw.length} theatres...`);
    for (const theatre of theatresRaw) {
      const theatreId = toObjectId(theatre._id);

      const count =
        Math.floor(Math.random() * (MAX_MOVIES - MIN_MOVIES + 1)) + MIN_MOVIES;

      const randomMovies = getRandomSubset(movieIds, count);

      await mongoose.connection.db.collection("theatres").updateOne(
        { _id: theatreId },
        {
          $addToSet: {
            movies: { $each: randomMovies },
          },
        },
      );
    }

    console.log("🎉 Seeding completed successfully");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seed();
