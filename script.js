document.addEventListener("DOMContentLoaded", function () {
    const firebaseConfig = {
  apiKey: "AIzaSyBCNYpBEQ325bUrjGRs1VG0zz2hoqnGFHg",
  authDomain: "cc-lab-5-ec1ab.firebaseapp.com",
  projectId: "cc-lab-5-ec1ab",
  storageBucket: "cc-lab-5-ec1ab.firebasestorage.app",
  messagingSenderId: "89378681943",
  appId: "1:89378681943:web:13949b74ead654e12e5f12",
  measurementId: "G-475LGRDQWK"
};
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    document.getElementById("registerBtn").addEventListener("click", async function () {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        try {
            let userCredential = await auth.createUserWithEmailAndPassword(email, password);
            alert("User registered successfully!");
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById("loginBtn").addEventListener("click", async function () {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        try {
            let userCredential = await auth.signInWithEmailAndPassword(email, password);
            alert("Login successful!");
        } catch (error) {
            alert(error.message);
        }
    });
});
