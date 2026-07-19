const mongoose = require("mongoose");
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}
const dbConnect = async () => {
  if (cached.conn) {
    console.log("Using cached DB connection.");
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      // bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("New DB connection created.");
        return mongoose;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
};

module.exports = { dbConnect };

