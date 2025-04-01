// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBCNYpBEQ325bUrjGRs1VG0zz2hoqnGFHg",
  authDomain: "cc-lab-5-ec1ab.firebaseapp.com",
  projectId: "cc-lab-5-ec1ab",
  storageBucket: "cc-lab-5-ec1ab.firebasestorage.app",
  messagingSenderId: "89378681943",
  appId: "1:89378681943:web:13949b74ead654e12e5f12",
  measurementId: "G-475LGRDQWK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register User
function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            let user = userCredential.user;
            
            // Store user info in Firestore
            return db.collection("users").doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
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
            let user = userCredential.user;
            return user.getIdToken().then(token => {
                sessionStorage.setItem("authToken", token);
                alert("Login Successful!");
            });
        })
        .catch(error => {
            alert(error.message);
        });
}
