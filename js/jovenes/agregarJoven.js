import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsdXo5EppGDPGRO-i2k_gr805H9mPc0-8",
    authDomain: "yeshua-811c4.firebaseapp.com",
    projectId: "yeshua-811c4",
    storageBucket: "yeshua-811c4.appspot.com",
    messagingSenderId: "110305399239",
    appId: "1:110305399239:web:4bdd7365491ecd23c849e2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('form-joven');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
    const direccion = document.getElementById('direccion').value;
    const genero = document.getElementById('genero').value;
    const telefono = document.getElementById('telefono').value;

    try {
        // 1. Guardar datos en Firestore
        await addDoc(collection(db, "jovenes"), {
            nombre,
            fecha_nacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
            direccion,
            genero,
            telefono,
            creado: new Date()
        });

        mensaje.textContent = "Joven registrado correctamente ✅";
        form.reset();
    } catch (error) {
        console.error("Error al registrar:", error);
        mensaje.textContent = "❌ Ocurrió un error al registrar al joven.";
    }
});