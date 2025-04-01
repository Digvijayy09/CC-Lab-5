const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

// Initialize Firestore
const db = admin.firestore();

// Register a user (Firebase Authentication & Firestore)
app.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await admin.auth().createUser({ email, password });

        // Store user details in Firestore
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

// Login User (Firebase Authentication)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await admin.auth().getUserByEmail(email);

        const token = await admin.auth().createCustomToken(user.uid);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Retrieve User Data from Firestore
app.get("/user/:uid", async (req, res) => {
    try {
        const userDoc = await db.collection("users").doc(req.params.uid).get();

        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
