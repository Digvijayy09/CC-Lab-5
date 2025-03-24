const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Datastore } = require("@google-cloud/datastore");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

// Initialize Google Cloud Datastore
const datastore = new Datastore();

// Register a user (Firebase Authentication)
app.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await admin.auth().createUser({ email, password });

        const userKey = datastore.key(["User", user.uid]);
        const userData = {
            key: userKey,
            data: { email, name, createdAt: new Date() },
        };
        await datastore.save(userData);

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

// Retrieve User Data from Datastore
app.get("/user/:uid", async (req, res) => {
    try {
        const userKey = datastore.key(["User", req.params.uid]);
        const [user] = await datastore.get(userKey);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
