import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  
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
  
    async function cargarJovenes() {
      const querySnapshot = await getDocs(collection(db, "jovenes"));
      lista.innerHTML = ""; // Limpia la lista
  
      querySnapshot.forEach((docItem) => {
        const joven = docItem.data();
        const id = docItem.id;
  
        const fechaNacimiento = formatearFecha(joven.fecha_nacimiento);
        const edad = calcularEdad(joven.fecha_nacimiento);
  
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");
        card.id = `joven-${id}`;
  
        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-center">${joven.nombre}</h5>
              <p><strong>Teléfono:</strong> ${joven.telefono}</p>
              <p><strong>Dirección:</strong> ${joven.direccion}</p>
              <p><strong>Género:</strong> ${joven.genero}</p>
              <p><strong>Fecha de cumpleaños:</strong> ${fechaNacimiento}</p>
              <p><strong>Edad:</strong> ${edad} años</p>
              <button class="btn btn-danger btn-sm" onclick="eliminarJoven('${id}')">Eliminar</button>
            </div>
          </div>
        `;
  
        lista.appendChild(card);
      });
    }
  
    // Hacer la función de eliminar visible globalmente
    window.eliminarJoven = eliminarJoven;
  
    cargarJovenes();