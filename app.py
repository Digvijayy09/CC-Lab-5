from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
from google.cloud import datastore

app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-admin-sdk.json")  # Download from Firebase Console
firebase_admin.initialize_app(cred)

# Initialize Google Cloud Datastore
datastore_client = datastore.Client()

# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    try:
        user = auth.create_user(email=email, password=password)
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

# Store User Data in Cloud Datastore
@app.route('/store_user_data', methods=['POST'])
def store_user_data():
    data = request.json
    id_token = data.get("idToken")

    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token["uid"]

        # Store user details (excluding password)
        entity = datastore.Entity(datastore_client.key("User", user_id))
        entity.update({
            "email": data.get("email"),
            "name": data.get("name"),
            "created_at": datastore.datetime.datetime.utcnow()
        })
        datastore_client.put(entity)

        return jsonify({"message": "User data stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
