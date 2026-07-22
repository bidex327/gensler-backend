const mongoose = require("mongoose");

let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}

const dbConnect = async () => {
  if (cached.conn) {
    console.log("✅ Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log(
      "MONGO_URI starts with:",
      process.env.MONGO_URI?.substring(0, 35)
    );

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
      })
      .then((mongoose) => {
        console.log("✅ Connected to:", mongoose.connection.host);
        console.log("✅ Database:", mongoose.connection.name);
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { dbConnect };