import http from "http";
import express from "express";
import cors from "cors";
import { Server, LobbyRoom } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { RoomType } from "../types/Rooms";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth/authRoutes";

// Import custom rooms
import { RemoteWorkspace } from "./rooms/RemoteWorkspace";

// Load environment variables
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 2567;

// Middleware setup
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Colyseus game server
const gameServer = new Server({ server });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Authentication routes
app.use("/api/auth", authRoutes);

// Register Colyseus rooms
gameServer.define(RoomType.LOBBY, LobbyRoom);
gameServer.define(RoomType.PUBLIC, RemoteWorkspace, {
  name: "Public Lobby",
  description: "For making friends and familiarizing yourself with the controls",
  password: null,
  autoDispose: false,
});
gameServer.define(RoomType.CUSTOM, RemoteWorkspace).enableRealtimeListing();

// Colyseus monitor (for debugging/admin)
app.use("/colyseus", monitor());

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
