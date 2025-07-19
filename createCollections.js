import mongoose from "mongoose";
import dotenv from "dotenv";

// Import all your models
import user from "./src/models/user.js";
import ticket from "./src/models/Ticket.js";
import bus from "./src/models/bus.js";
import admin from "./src/models/admin.js";
import staff from "./src/models/staff.js";
import busRoute from "./src/models/bus_route.js";
import busStop from "./src/models/bus_stop.js";

dotenv.config();

async function createCollections() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Create at least one document in each collection to make them visible
        console.log("Creating sample documents...");

        // Create sample documents (these will be removed after creation)
        await ticket.create({
            userId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "Sample Source",
            destination: "Sample Destination",
            fare: 0
        });

        await admin.create({
            name: "Temp Admin",
            email: "temp@admin.com",
            password: "temp123",
            role: "admin"
        });

        await staff.create({
            name: "Temp Staff",
            email: "temp@staff.com",
            password: "temp123",
            role: "staff"
        });

        await busRoute.create({
            routeName: "Temp Route",
            startLocation: "Start",
            endLocation: "End",
            distance: 0
        });

        await busStop.create({
            stopName: "Temp Stop",
            location: "Temp Location",
            coordinates: { latitude: 0, longitude: 0 }
        });

        console.log("Sample documents created!");

        // Now delete the sample documents
        console.log("Cleaning up sample documents...");
        await ticket.deleteOne({ source: "Sample Source" });
        await admin.deleteOne({ email: "temp@admin.com" });
        await staff.deleteOne({ email: "temp@staff.com" });
        await busRoute.deleteOne({ routeName: "Temp Route" });
        await busStop.deleteOne({ stopName: "Temp Stop" });

        console.log("Sample documents removed, but collections remain!");

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\nCollections in database:");
        collections.forEach(collection => {
            console.log("- " + collection.name);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed");
    }
}

createCollections();
