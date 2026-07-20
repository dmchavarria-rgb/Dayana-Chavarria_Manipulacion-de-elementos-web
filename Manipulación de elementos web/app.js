let estudiantes = [];
let editIndex = null;

// Referencias a elementos
const nombreInput = document.getElementById("nombre");
const carreraSelect = document.getElementById("carrera");
const semestreInput = document.getElementById("semestre");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const totalEstudiantes = document.getElementById("totalEstudiantes");

// Botones
const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");

// Registrar o editar estudiante
btnAgregar.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  const carrera = carreraSelect.value;
  const semestre = semestreInput.value.trim();

  if (!nombre || !carrera || !semestre) {
    Swal.fire("Error", "Complete todos los campos", "warning");
    return;
  }

  if (editIndex === null) {
    estudiantes.push({ nombre, carrera, semestre });
    Swal.fire("Agregado", "Estudiante registrado correctamente", "success");
  } else {
    estudiantes[editIndex] = { nombre, carrera, semestre };
    editIndex = null;
    btnAgregar.textContent = "Agregar estudiante";
    Swal.fire("Editado", "Estudiante actualizado correctamente", "info");
  }

  actualizarTabla();
  actualizarContador();
  limpiarFormulario();
});

// Actualizar tabla con acciones
function actualizarTabla() {
  cuerpoTabla.innerHTML = "";
  estudiantes.forEach((est, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${est.nombre}</td>
      <td>${est.carrera}</td>
      <td>${est.semestre}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick="verJSON(${index})">Ver JSON</button>
        <button class="btn btn-warning btn-sm" onclick="editarEstudiante(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${index})">Eliminar</button>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

// Ver JSON individual
function verJSON(index) {
  document.getElementById("modalBody").textContent = JSON.stringify(estudiantes[index], null, 2);
  new bootstrap.Modal(document.getElementById("jsonModal")).show();
}

// Ver JSON general
document.getElementById("btnJSONGeneral").addEventListener("click", () => {
  if (estudiantes.length === 0) {
    Swal.fire("Aviso", "No existen estudiantes registrados", "info");
  } else {
    document.getElementById("modalBody").textContent = JSON.stringify(estudiantes, null, 2);
    new bootstrap.Modal(document.getElementById("jsonModal")).show();
  }
});

// Editar estudiante
function editarEstudiante(index) {
  const est = estudiantes[index];
  nombreInput.value = est.nombre;
  carreraSelect.value = est.carrera;
  semestreInput.value = est.semestre;
  btnAgregar.textContent = "Guardar cambios";
  editIndex = index;
}

// Eliminar estudiante con confirmación
function eliminarEstudiante(index) {
  Swal.fire({
    title: "¿Eliminar estudiante?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      estudiantes.splice(index, 1);
      actualizarTabla();
      actualizarContador();
      Swal.fire("Eliminado", "El estudiante ha sido eliminado", "success");
    }
  });
}

// Contador
function actualizarContador() {
  totalEstudiantes.textContent = estudiantes.length;
}

// Limpiar formulario
function limpiarFormulario() {
  nombreInput.value = "";
  carreraSelect.value = "";
  semestreInput.value = "";
}

// Limpiar todo
btnLimpiar.addEventListener("click", () => {
  estudiantes = [];
  actualizarTabla();
  actualizarContador();
  limpiarFormulario();
  Swal.fire("Limpieza", "Se han eliminado todos los registros", "info");
});

// Búsqueda
document.getElementById("btnBuscar").addEventListener("click", () => {
  const texto = document.getElementById("buscarInput").value.toLowerCase();
  const resultados = estudiantes.filter(est =>
    est.nombre.toLowerCase().includes(texto) ||
    est.carrera.toLowerCase().includes(texto) ||
    est.semestre.toLowerCase().includes(texto)
  );
  cuerpoTabla.innerHTML = "";
  resultados.forEach((est, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${est.nombre}</td>
      <td>${est.carrera}</td>
      <td>${est.semestre}</td>
    `;
    cuerpoTabla.appendChild(fila);
  });
});

document.getElementById("btnLimpiarBusqueda").addEventListener("click", () => {
  document.getElementById("buscarInput").value = "";
  actualizarTabla();
});

// Filtro por carrera
document.getElementById("btnFiltrar").addEventListener("click", () => {
  const carreraSeleccionada = document.getElementById("filtroCarrera").value;
  if (carreraSeleccionada === "Todas") {
    actualizarTabla();
  } else {
    const filtrados = estudiantes.filter(est => est.carrera === carreraSeleccionada);
    cuerpoTabla.innerHTML = "";
    filtrados.forEach((est, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${est.nombre}</td>
        <td>${est.carrera}</td>
        <td>${est.semestre}</td>
      `;
      cuerpoTabla.appendChild(fila);
    });
  }
});
