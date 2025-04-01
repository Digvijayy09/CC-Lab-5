const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register a user (Firebase Authentication & Firestore)
app.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await admin.auth().createUser({ email, password });

        // Store user data in Firestore
        await db.collection("users").doc(user.uid).set({
            email,
            name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: "User registered successfully", uid: user.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login User (Frontend should handle authentication)
app.post("/login", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await admin.auth().getUserByEmail(email);

        // Generate a custom authentication token (optional)
        const token = await admin.auth().createCustomToken(user.uid);
        res.json({ message: "User found!", uid: user.uid, token });
    } catch (error) {
        res.status(400).json({ error: "Invalid login credentials" });
    }
});

// Retrieve User Data from Firestore
app.get("/user/:uid", async (req, res) => {
    try {
        const userRef = db.collection("users").doc(req.params.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
