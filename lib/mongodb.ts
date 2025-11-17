import mongoose, { type Mongoose } from "mongoose";

/**
 * MongoDB Connection Configuration
 *
 * This module handles MongoDB database connection using Mongoose with proper
 * connection caching to prevent multiple connections in development mode.
 */

// Define the connection interface for better type safety
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
declare global {
  var mongooseGlobal: MongooseConnection | undefined;
}

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Validates that the MongoDB URI is properly configured
 * @throws {Error} If MONGODB_URI is not defined
 */
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global mongoose connection cache
 * In production, this variable will be undefined and we'll create a new connection
 * In development, we use the cached connection to prevent multiple connections
 */
const cached: MongooseConnection = globalThis.mongooseGlobal || {
  conn: null,
  promise: null,
};

/**
 * Cache the connection in global scope for development hot reloading
 * This prevents creating multiple connections during development
 */
if (process.env.NODE_ENV === "development") {
  globalThis.mongooseGlobal = cached;
}

/**
 * Database connection function with caching
 *
 * This function ensures that we maintain a single connection to MongoDB
 * throughout the application lifecycle, preventing connection pool exhaustion.
 *
 * @returns {Promise<typeof mongoose>} The mongoose instance
 * @throws {Error} If connection fails
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have an active connection, return it
  if (cached.conn) {
    console.log("🔄 Using existing MongoDB connection");
    return cached.conn;
  }

  // If we don't have a connection promise, create one
  if (!cached.promise) {
    console.log("🔌 Creating new MongoDB connection...");

    // Mongoose connection options for optimal performance and stability
    const options = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      serverSelectionTimeoutMS: 5000, // How long mongoose will attempt to connect
      socketTimeoutMS: 45000, // How long a socket stays open after inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Create the connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI as string, options)
      .then((mongooseInstance) => {
        console.log("✅ Successfully connected to MongoDB");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        // Clear the cached promise on error so we can retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear the cached promise on error
    cached.promise = null;
    throw error;
  }
}

/**
 * Gracefully disconnect from MongoDB
 *
 * This function should be called when the application is shutting down
 * to ensure proper cleanup of database connections.
 *
 * @returns {Promise<void>}
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (cached.conn) {
      console.log("🔌 Disconnecting from MongoDB...");
      await cached.conn.disconnect();
      cached.conn = null;
      cached.promise = null;
      console.log("✅ Successfully disconnected from MongoDB");
    }
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
    throw error;
  }
}

/**
 * Get the current connection status
 *
 * @returns {number} The mongoose connection ready state
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export function getConnectionStatus(): number {
  return mongoose.connection.readyState;
}

/**
 * Check if the database is connected
 *
 * @returns {boolean} True if connected, false otherwise
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Connection event handlers for monitoring
 * These handlers provide useful logging for debugging connection issues
 */
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟠 Mongoose disconnected from MongoDB");
});

/**
 * Handle application termination gracefully
 * This ensures that we close the database connection when the process terminates
 */
if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    try {
      await disconnectFromDatabase();
      process.exit(0);
    } catch (error) {
      console.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  });
}

// Export the default connection function
export default connectToDatabase;
