from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore

app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-admin-sdk.json")  # Ensure this file exists
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    try:
        user = auth.create_user(email=email, password=password)

        # Store user in Firestore (without password)
        db.collection("users").document(user.uid).set({
            "email": email,
            "name": name,
            "created_at": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "User registered successfully", "uid": user.uid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    id_token = data.get("idToken")

    try:
        decoded_token = auth.verify_id_token(id_token)
        return jsonify({"message": "User authenticated", "uid": decoded_token["uid"]}), 200
    except Exception as e:
        return jsonify({"error": "Invalid Token"}), 401

# Store User Data in Firestore
@app.route('/store_user_data', methods=['POST'])
def store_user_data():
    data = request.json
    id_token = data.get("idToken")

    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token["uid"]

        # Store user details (excluding password)
        db.collection("users").document(user_id).update({
            "email": data.get("email"),
            "name": data.get("name"),
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "User data stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
