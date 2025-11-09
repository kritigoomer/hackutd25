import express from "express";
import users from "./user.js";
import chatRouter from "./Services/chat.js"; // ✅ add this

console.log("index.js is running");
const app = express();

app.use(express.json());
app.get("/", (req, res) => res.send("Server is ready"));
app.get("/api/user", (req, res) => res.send(users));
app.use("/api/chat", chatRouter); // ✅ now defined

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serve at http://localhost:${port}`));
