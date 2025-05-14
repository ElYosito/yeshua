import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

const lista = document.getElementById("lista-jovenes");
const form = document.getElementById("form-joven");
const mensaje = document.getElementById("mensaje") || null;

let modoEditar = false;
let idEditar = null;

function formatearFecha(timestamp) {
  if (!timestamp?.seconds) return "No registrada";
  const fecha = new Date(timestamp.seconds * 1000);
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-MX', opciones);
}

function calcularEdad(timestamp) {
  if (!timestamp?.seconds) return "No disponible";
  const nacimiento = new Date(timestamp.seconds * 1000);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

async function eliminarJoven(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
    await deleteDoc(doc(db, "jovenes", id));
    document.getElementById(`joven-${id}`).remove();
  }
}

async function editarJoven(id) {
  const docRef = doc(db, "jovenes", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const joven = docSnap.data();

    document.getElementById("nombre").value = joven.nombre;
    document.getElementById("direccion").value = joven.direccion;
    document.getElementById("telefono").value = joven.telefono;
    document.getElementById("genero").value = joven.genero;

    const fecha = new Date(joven.fecha_nacimiento.seconds * 1000);
    document.getElementById("fecha_nacimiento").value = fecha.toISOString().split("T")[0];

    modoEditar = true;
    idEditar = id;

    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
  } else {
    alert("No se pudo obtener la información del joven.");
  }
}

async function cargarJovenes() {
  let total = 0;
  let mayores = 0;
  let menores = 0;
  let hombres = 0;
  let mujeres = 0;

  const querySnapshot = await getDocs(collection(db, "jovenes"));
  lista.innerHTML = "";

  querySnapshot.forEach((docItem) => {
    const joven = docItem.data();
    const id = docItem.id;

    const fechaNacimiento = formatearFecha(joven.fecha_nacimiento);
    const edad = calcularEdad(joven.fecha_nacimiento);

    total++;

    if (edad >= 18) {
      mayores++;
    } else {
      menores++;
    }

    if (joven.genero === "Masculino") {
      hombres++;
    } else if (joven.genero === "Femenino") {
      mujeres++;
    }

    const card = document.createElement("div");
    card.classList.add("col-md-6", "mb-1");
    card.id = `joven-${id}`;

    card.innerHTML = `
      <div class="card h-100 shadow-lg border-0 rounded-4 bg-light">
        <div class="card-body">
          <div class="text-center mb-3">
            <i class='bx bxs-user-circle' style="font-size: 3rem; color: #0d6efd;"></i>
            <h5 class="card-title fw-bold mt-2">${joven.nombre}</h5>
          </div>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item"><strong>📞 Teléfono:</strong> ${joven.telefono}</li>
            <li class="list-group-item"><strong>🏠 Dirección:</strong> ${joven.direccion}</li>
            <li class="list-group-item"><strong>👤 Género:</strong> ${joven.genero}</li>
            <li class="list-group-item"><strong>🎂 Cumpleaños:</strong> ${fechaNacimiento}</li>
            <li class="list-group-item"><strong>🎈 Edad:</strong> ${edad} años</li>
          </ul>
          <div class="text-center">
            <button class="btn btn-outline-danger btn-sm rounded-pill px-4" onclick="eliminarJoven('${id}')">
              <i class='bx bxs-trash'></i> Eliminar
            </button>
            <button class="btn btn-outline-primary btn-sm rounded-pill px-4" onclick="editarJoven('${id}')">
              <i class='bx bxs-pencil'></i> Editar
            </button>
          </div>
        </div>
      </div>
    `;

    lista.appendChild(card);
  });

  // ✅ Actualizamos contadores después del bucle
  document.getElementById("total").textContent = total;
  document.getElementById("mayores").textContent = mayores;
  document.getElementById("menores").textContent = menores;
  document.getElementById("hombres").textContent = hombres;
  document.getElementById("mujeres").textContent = mujeres;
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const fechaInput = document.getElementById("fecha_nacimiento").value;
  const [year, month, day] = fechaInput.split("-");
  const fecha_nacimiento = new Date(year, month - 1, day); // evita problema de zona horaria

  const direccion = document.getElementById("direccion").value;
  const genero = document.getElementById("genero").value;
  const telefono = document.getElementById("telefono").value;

  const jovenData = {
    nombre,
    fecha_nacimiento,
    direccion,
    genero,
    telefono
  };

  try {
    if (modoEditar && idEditar) {
      // Editar existente
      await updateDoc(doc(db, "jovenes", idEditar), jovenData);
    } else {
      // Registrar nuevo
      await addDoc(collection(db, "jovenes"), {
        ...jovenData,
        creado: new Date()
      });
    }

    if (mensaje) {
      mensaje.textContent = modoEditar ? "✅ Joven editado correctamente" : "✅ Joven registrado correctamente";
    }

    modoEditar = false;
    idEditar = null;
    form.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    modal.hide();
    cargarJovenes();
  } catch (error) {
    console.error("Error:", error);
    if (mensaje) mensaje.textContent = "❌ Ocurrió un error al guardar.";
  }
});

// Hacer visibles las funciones globalmente
window.eliminarJoven = eliminarJoven;
window.editarJoven = editarJoven;

cargarJovenes();
