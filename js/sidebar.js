// Importar Firebase y Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCsdXo5EppGDPGRO-i2k_gr805H9mPc0-8",
    authDomain: "yeshua-811c4.firebaseapp.com",
    projectId: "yeshua-811c4",
    storageBucket: "yeshua-811c4.firebasestorage.app",
    messagingSenderId: "110305399239",
    appId: "1:110305399239:web:4bdd7365491ecd23c849e2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Referencias del DOM
const cloud = document.getElementById("cloud");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");

let usuarioActual = null;

// Asignación de cargos según el correo
const cargosPorCorreo = {
    "yosmar@hotmail.com": "Presidente",
    "invitado@hotmail.com": "siJalo",
    "yoseline@hotmail.com": "Secretaria"
    // Agrega más correos aquí según necesites
};

// Detectar usuario logueado y cargar sus preferencias
onAuthStateChanged(auth, async (user) => {
    const spanNombre = document.querySelector(".nombre");
    const spanEmail = document.querySelector(".email");

    if (user) {
        usuarioActual = user;

        // Obtener correo y nombre
        const correo = user.email;
        const nombreBase = correo.split("@")[0]; // Ej: "yosmarcoronado"
        const nombreCapitalizado = nombreBase.charAt(0).toUpperCase() + nombreBase.slice(1); // Ej: "Yosmarcoronado"

        // Mostrar nombre
        if (spanNombre) spanNombre.textContent = nombreCapitalizado;

        // Mostrar cargo
        const cargo = cargosPorCorreo[correo] || "Miembro"; // Por defecto "Miembro"
        if (spanEmail) spanEmail.textContent = cargo;

        // Obtener preferencias desde Firestore
        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Aplicar modo oscuro
            if (data.modoOscuro) {
                document.body.classList.add("dark-mode");
                circulo.classList.add("prendido");
            }

            // Aplicar estado del sidebar
            if (data.sidebarColapsado) {
                barraLateral.classList.add("mini-barra-lateral");
                main.classList.add("min-main");
                spans.forEach(span => span.classList.add("oculto"));
            }
        } else {
            // Crear documento por primera vez si no existe
            await setDoc(userRef, {
                modoOscuro: false,
                sidebarColapsado: false
            });
        }
    }
});


// Guardar preferencia del usuario en Firestore
function guardarPreferencia(campo, valor) {
    if (!usuarioActual) return;
    const userRef = doc(db, "usuarios", usuarioActual.uid);
    setDoc(userRef, { [campo]: valor }, { merge: true });
}

// Botón menú hamburguesa
menu.addEventListener("click", () => {
    barraLateral.classList.toggle("max-barra-lateral");

    if (barraLateral.classList.contains("max-barra-lateral")) {
        menu.children[0].style.display = "none";
        menu.children[1].style.display = "block";
    } else {
        menu.children[0].style.display = "block";
        menu.children[1].style.display = "none";
    }

    if (window.innerWidth <= 320) {
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span) => span.classList.add("oculto"));
    }
});

// Palanca del modo oscuro
palanca.addEventListener("click", () => {
    let body = document.body;
    let dark = body.classList.toggle("dark-mode");
    circulo.classList.toggle("prendido");
    guardarPreferencia("modoOscuro", dark);
});

// Botón nube para colapsar el sidebar
cloud.addEventListener("click", () => {
    const colapsado = barraLateral.classList.toggle("mini-barra-lateral");
    main.classList.toggle("min-main");
    spans.forEach((span) => span.classList.toggle("oculto"));
    guardarPreferencia("sidebarColapsado", colapsado);
});
