
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'password_vault';

if(!MONGODB_URI){
    throw new Error("Please defind the MONGODB_URI .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if(!global.mongoose){
    global.mongoose = cached;
}

export async function connectDB(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: false,
            dbName: MONGODB_DB,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts);

    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected successfully');

    } catch (error) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
    return cached.conn;
}
export default connectDB;