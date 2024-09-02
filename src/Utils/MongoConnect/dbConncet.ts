import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URL;
const dbConnect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: "EventManager",
            bufferCommands: true,
        });
        console.log("Connected");
    } catch (err: any) {
        console.log("Error: ", err);
        throw new Error("Error: ", err);
    }
};

export default dbConnect;