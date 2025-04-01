// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBCNYpBEQ325bUrjGRs1VG0zz2hoqnGFHg",
  authDomain: "cc-lab-5-ec1ab.firebaseapp.com",
  projectId: "cc-lab-5-ec1ab",
  storageBucket: "cc-lab-5-ec1ab.appspot.com",  // Fixed incorrect URL
  messagingSenderId: "89378681943",
  appId: "1:89378681943:web:13949b74ead654e12e5f12",
  measurementId: "G-475LGRDQWK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();  // Initialize Firestore

// Register User
function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value; // Added name field

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            let user = userCredential.user;
            
            // Store user info in Firestore
            return db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                return user.getIdToken();
            });
        })
        .then(token => {
            sessionStorage.setItem("authToken", token);
            alert("User Registered Successfully!");
        })
        .catch(error => {
            alert(error.message);
        });
}

// Login User
function login() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            return userCredential.user.getIdToken();
        })
        .then(token => {
            sessionStorage.setItem("authToken", token);
            alert("Login Successful!");
        })
        .catch(error => {
            alert(error.message);
        });
}
