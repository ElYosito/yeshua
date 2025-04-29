import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "AIzaSyCsdXo5EppGDPGRO-i2k_gr805H9mPc0-8",
      authDomain: "yeshua-811c4.firebaseapp.com",
      projectId: "yeshua-811c4",
      storageBucket: "yeshua-811c4.appspot.com",
      messagingSenderId: "110305399239",
      appId: "1:110305399239:web:4bdd7365491ecd23c849e2"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const loginBtn = document.getElementById("loginBtn");
    const status = document.getElementById("status");

    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        status.textContent = "✅ Inicio de sesión exitoso.";
        // Redireccionar a otra página
        window.location.href = "html/noticias.html"; // Cambia esto por tu panel principal
      } catch (error) {
        console.error(error.message);
        status.textContent = "❌ Credenciales incorrectas o usuario no registrado.";
      }
    });