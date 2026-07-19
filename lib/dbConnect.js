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
      serverSelectionTimeoutMS: 30000,
    };
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI.replace(/:\/\/.*:/, "://****:")
);

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
       
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connect error:", err);
        throw err;
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





// const dbConnect = async () => {
//   if (cached.conn) {
//     console.log("Using cached DB connection.");
//     return cached.conn;
//   }
//   if (!cached.promise) {
//     const opts = {
//       // bufferCommands: false,
//       serverSelectionTimeoutMS: 30000,
//     };

//     cached.promise = mongoose
//       .connect(process.env.MONGO_URI, opts)
//       .then((mongoose) => {
//         console.log("New DB connection created.");
//         return mongoose;
//       });
//   }
//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }
//   return cached.conn;
// };

// const dbConnect = async () => {
//   if (cached.conn) {
//     console.log("Using cached DB connection.");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       serverSelectionTimeoutMS: 30000,
//     };

//     console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
//     console.log(
//       "MONGO_URI starts with:",
//       process.env.MONGO_URI?.substring(0, 30)
//     );

//     cached.promise = mongoose
//       .connect(process.env.MONGO_URI, opts)
//       .then((mongoose) => {
//         console.log("✅ Connected to:", mongoose.connection.host);
//         console.log("✅ Database:", mongoose.connection.name);
//         console.log("✅ New DB connection created.");
//         return mongoose;
//       })
//       .catch((err) => {
//         console.error("❌ MongoDB connect error:", err);
//         throw err;
//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// };

module.exports = { dbConnect };

