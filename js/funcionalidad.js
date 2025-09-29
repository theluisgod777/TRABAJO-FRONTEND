// Variables globales
const estudiantesData = [
  {
    codigo: "2022101",
    identificacion: "1110881234456",
    nombre: "Camila Fernández Rojas",
    grado: "10",
    grupo: "A",
    estado: "en-curso",
  },
  {
    codigo: "2022102",
    identificacion: "1110881234499",
    nombre: "Juan Felipe Montoya Ríos",
    grado: "10",
    grupo: "A",
    estado: "aprobado",
  },
  {
    codigo: "2022103",
    identificacion: "CC 1058456789",
    nombre: "Luisa María Cruz Hernández",
    grado: "10",
    grupo: "B",
    estado: "reprobado",
  },
  {
    codigo: "2022104",
    identificacion: "1110881200099",
    nombre: "Ana María Bedoya López",
    grado: "10",
    grupo: "B",
    estado: "en-curso",
  },
  {
    codigo: "2022105",
    identificacion: "1110870134499",
    nombre: "Santiago Sánchez Rivera",
    grado: "10",
    grupo: "A",
    estado: "en-curso",
  },
]

let estudianteSeleccionado = null

// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos()
  cargarEstudiantesEnFiltro()
})

// Función para inicializar todos los eventos
function inicializarEventos() {
  // Navegación del menú lateral
  const elementosMenu = document.querySelectorAll(".elemento-menu")
  elementosMenu.forEach((elemento) => {
    elemento.addEventListener("click", function (e) {
      e.preventDefault()
      const seccion = this.dataset.seccion
      cambiarSeccion(seccion)
    })
  })

  // Botón nuevo registro
  const botonNuevoRegistro = document.getElementById("botonNuevoRegistro")
  if (botonNuevoRegistro) {
    botonNuevoRegistro.addEventListener("click", () => {
      mostrarFormularioEstudiante()
    })
  }

  // Botones de filtro
  const botonBuscar = document.getElementById("botonBuscar")
  if (botonBuscar) {
    botonBuscar.addEventListener("click", aplicarFiltros)
  }

  const botonLimpiar = document.getElementById("botonLimpiar")
  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", limpiarFiltros)
  }

  // Botones de acción en la tabla
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("ver") || e.target.closest(".ver")) {
      const fila = e.target.closest("tr")
      const codigo = fila.cells[0].textContent
      verEstudiante(codigo)
    }

    if (e.target.classList.contains("eliminar") || e.target.closest(".eliminar")) {
      const fila = e.target.closest("tr")
      const codigo = fila.cells[0].textContent
      const nombre = fila.cells[2].textContent
      mostrarVentanaEliminar(codigo, nombre)
    }
  })

  //Ventana de eliminación
  const ventanaEliminar = document.getElementById("ventanaEliminar")
  const cerrarVentana = document.getElementById("cerrarVentana")
  const botonCancelar = document.getElementById("botonCancelar")
  const botonConfirmar = document.getElementById("botonConfirmar")

  if (cerrarVentana) {
    cerrarVentana.addEventListener("click", cerrarVentanaEliminar)
  }

  if (botonCancelar) {
    botonCancelar.addEventListener("click", cerrarVentanaEliminar)
  }

  if (botonConfirmar) {
    botonConfirmar.addEventListener("click", confirmarEliminacion)
  }

  // Cerrar ventana al hacer clic fuera
  if (ventanaEliminar) {
    ventanaEliminar.addEventListener("click", (e) => {
      if (e.target === ventanaEliminar) {
        cerrarVentanaEliminar()
      }
    })
  }

  // Evento para abrir ventana de imagen de perfil
  const imagenPerfil = document.getElementById("imagenPerfil")
  if (imagenPerfil) {
    imagenPerfil.addEventListener("click", abrirVentanaImagenPerfil)
  }

  // Eventos para cerrar ventana de imagen de perfil
  const ventanaImagenPerfil = document.getElementById("ventanaImagenPerfil")
  const cerrarVentanaImagen = document.getElementById("cerrarVentanaImagen")

  if (cerrarVentanaImagen) {
    cerrarVentanaImagen.addEventListener("click", cerrarVentanaImagenPerfil)
  }

  // Cerrar ventana de imagen al hacer clic fuera
  if (ventanaImagenPerfil) {
    ventanaImagenPerfil.addEventListener("click", (e) => {
      if (e.target === ventanaImagenPerfil) {
        cerrarVentanaImagenPerfil()
      }
    })
  }

  // Cerrar ventana de imagen con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarVentanaImagenPerfil()
    }
  })

  // Navegación de regreso
  const volverEstudiantes = document.getElementById("volverEstudiantes")
  if (volverEstudiantes) {
    volverEstudiantes.addEventListener("click", (e) => {
      e.preventDefault()
      cambiarSeccion("estudiantes")
    })
  }

  // Ordenamiento de tablas
  const encabezadosTabla = document.querySelectorAll(".encabezado-tabla")
  encabezadosTabla.forEach((encabezado) => {
    encabezado.addEventListener("click", function () {
      ordenarTabla(this)
    })
  })

  const botonCancelarFormulario = document.getElementById("botonCancelarFormulario")
  const botonGuardarFormulario = document.getElementById("botonGuardarFormulario")

  if (botonCancelarFormulario) {
    botonCancelarFormulario.addEventListener("click", (e) => {
      e.preventDefault()
      cambiarSeccion("estudiantes")
    })
  }

  if (botonGuardarFormulario) {
    botonGuardarFormulario.addEventListener("click", (e) => {
      e.preventDefault()
      guardarEstudiante()
    })
  }
}

function abrirVentanaImagenPerfil() {
  const ventana = document.getElementById("ventanaImagenPerfil")
  const imagenAmpliada = document.getElementById("imagenPerfilAmpliada")
  const imagenOriginal = document.getElementById("imagenPerfil")

  if (ventana && imagenAmpliada && imagenOriginal) {
    // Copiar la imagen original a la ventana
    imagenAmpliada.src = imagenOriginal.src
    imagenAmpliada.alt = imagenOriginal.alt

    // Mostrar la ventana
    ventana.classList.add("activo")

    // Prevenir scroll del body
    document.body.style.overflow = "hidden"
  }
}

function cerrarVentanaImagenPerfil() {
  const ventana = document.getElementById("ventanaImagenPerfil")

  if (ventana) {
    ventana.classList.remove("activo")

    // Restaurar scroll del body
    document.body.style.overflow = "auto"
  }
}

// Función para cambiar de sección
function cambiarSeccion(seccion) {
  // Actualizar menú activo
  const elementosMenu = document.querySelectorAll(".elemento-menu")
  elementosMenu.forEach((elemento) => {
    elemento.classList.remove("activo")
    if (elemento.dataset.seccion === seccion) {
      elemento.classList.add("activo")
    }
  })

  // Mostrar sección correspondiente
  const secciones = document.querySelectorAll(".seccion-contenido")
  secciones.forEach((seccionElemento) => {
    seccionElemento.classList.remove("activa")
  })

  const seccionActiva = document.getElementById(`seccion-${seccion}`)
  if (seccionActiva) {
    seccionActiva.classList.add("activa")
  }
}

// Función para cargar estudiantes en el filtro
function cargarEstudiantesEnFiltro() {
  const filtroEstudiante = document.getElementById("filtroEstudiante")
  if (filtroEstudiante) {
    // Limpiar opciones existentes excepto la primera
    filtroEstudiante.innerHTML = '<option value="">Seleccionar</option>'

    // Agregar estudiantes
    estudiantesData.forEach((estudiante) => {
      const opcion = document.createElement("option")
      opcion.value = estudiante.codigo
      opcion.textContent = estudiante.nombre
      filtroEstudiante.appendChild(opcion)
    })
  }
}

// Función para aplicar filtros
function aplicarFiltros() {
  const filtroGrado = document.getElementById("filtroGrado").value
  const filtroGrupo = document.getElementById("filtroGrupo").value
  const filtroIdentificacion = document.getElementById("filtroIdentificacion").value
  const filtroEstudiante = document.getElementById("filtroEstudiante").value

  const estudiantesFiltrados = estudiantesData.filter((estudiante) => {
    let cumpleFiltros = true

    if (filtroGrado && estudiante.grado !== filtroGrado) {
      cumpleFiltros = false
    }

    if (filtroGrupo && estudiante.grupo !== filtroGrupo) {
      cumpleFiltros = false
    }

    if (filtroIdentificacion && !estudiante.identificacion.toLowerCase().includes(filtroIdentificacion.toLowerCase())) {
      cumpleFiltros = false
    }

    if (filtroEstudiante && estudiante.codigo !== filtroEstudiante) {
      cumpleFiltros = false
    }

    return cumpleFiltros
  })

  actualizarTablaEstudiantes(estudiantesFiltrados)
  mostrarMensaje(`Se encontraron ${estudiantesFiltrados.length} resultados`)
}

// Función para limpiar filtros
function limpiarFiltros() {
  document.getElementById("filtroGrado").value = ""
  document.getElementById("filtroGrupo").value = ""
  document.getElementById("filtroIdentificacion").value = ""
  document.getElementById("filtroEstudiante").value = ""

  actualizarTablaEstudiantes(estudiantesData)
  mostrarMensaje("Filtros limpiados")
}

// Función para actualizar la tabla de estudiantes
function actualizarTablaEstudiantes(estudiantes) {
  const cuerpoTabla = document.getElementById("cuerpoTablaEstudiantes")
  if (!cuerpoTabla) return

  cuerpoTabla.innerHTML = ""

  estudiantes.forEach((estudiante) => {
    const fila = document.createElement("tr")

    const estadoClase = estudiante.estado.replace("-", "-")
    const estadoTexto =
      estudiante.estado === "en-curso" ? "En curso" : estudiante.estado === "aprobado" ? "Aprobado" : "Reprobado"

    fila.innerHTML = `
            <td>${estudiante.codigo}</td>
            <td>${estudiante.identificacion}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.grado}</td>
            <td>${estudiante.grupo}</td>
            <td><span class="estado ${estadoClase}">${estadoTexto}</span></td>
            <td class="acciones">
                <button class="boton-accion ver" title="Ver">👁</button>
                <button class="boton-accion eliminar" title="Eliminar">🗑</button>
            </td>
        `

    cuerpoTabla.appendChild(fila)
  })
}

// Función para mostrar el formulario de estudiante
function mostrarFormularioEstudiante(codigo = null) {
  cambiarSeccion("info-estudiante")

  if (codigo) {
    const estudiante = estudiantesData.find((e) => e.codigo === codigo)
    if (estudiante) {
      cargarDatosEstudiante(estudiante)
    }
  } else {
    limpiarFormularioEstudiante()
  }
}

// Función para ver un estudiante específico
function verEstudiante(codigo) {
  mostrarFormularioEstudiante(codigo)
}

// Función para cargar datos del estudiante en el formulario
function cargarDatosEstudiante(estudiante) {
  document.getElementById("codigoEstudiante").value = estudiante.codigo
  // Aquí se cargarían más datos si estuvieran disponibles
  mostrarMensaje(`Cargando información de ${estudiante.nombre}`)
}

// Función para limpiar el formulario de estudiante
function limpiarFormularioEstudiante() {
  const campos = document.querySelectorAll(".campo-entrada-tabla, .selector-campo-tabla")
  campos.forEach((campo) => {
    if (campo.type !== "radio") {
      campo.value = ""
    }
  })

  // Reset radio buttons
  const radioButtons = document.querySelectorAll('input[name="sexo"]')
  radioButtons.forEach((radio, index) => {
    radio.checked = index === 0 // Check first radio button (Femenino)
  })

  // Generar nuevo código
  const nuevoCodigo = "2022" + String(estudiantesData.length + 101).padStart(3, "0")
  document.getElementById("codigoEstudiante").value = nuevoCodigo
}

// Función para mostrar ventana de eliminación
function mostrarVentanaEliminar(codigo, nombre) {
  estudianteSeleccionado = codigo
  const ventana = document.getElementById("ventanaEliminar")
  const titulo = ventana.querySelector(".ventana-titulo")

  titulo.textContent = `Eliminar ${nombre}`
  ventana.classList.add("activo")
}

// Función para cerrar ventana de eliminación
function cerrarVentanaEliminar() {
  const ventana = document.getElementById("ventanaEliminar")
  ventana.classList.remove("activo")
  estudianteSeleccionado = null
}

// Función para confirmar eliminación
function confirmarEliminacion() {
  if (estudianteSeleccionado) {
    const indice = estudiantesData.findIndex((e) => e.codigo === estudianteSeleccionado)
    if (indice !== -1) {
      const nombreEliminado = estudiantesData[indice].nombre
      estudiantesData.splice(indice, 1)
      actualizarTablaEstudiantes(estudiantesData)
      cargarEstudiantesEnFiltro()
      mostrarMensaje(`Estudiante ${nombreEliminado} eliminado correctamente`)
    }
  }
  cerrarVentanaEliminar()
}

// Función para ordenar tabla
function ordenarTabla(encabezado) {
  const tabla = encabezado.closest("table")
  const indiceColumna = Array.from(encabezado.parentNode.children).indexOf(encabezado)
  const cuerpoTabla = tabla.querySelector("tbody")
  const filas = Array.from(cuerpoTabla.querySelectorAll("tr"))

  // Determinar dirección de ordenamiento
  const esAscendente = !encabezado.classList.contains("ordenado-desc")

  // Limpiar indicadores de ordenamiento previos
  tabla.querySelectorAll(".encabezado-tabla").forEach((th) => {
    th.classList.remove("ordenado-asc", "ordenado-desc")
  })

  // Agregar indicador de ordenamiento actual
  encabezado.classList.add(esAscendente ? "ordenado-asc" : "ordenado-desc")

  // Ordenar filas
  filas.sort((a, b) => {
    const valorA = a.cells[indiceColumna].textContent.trim()
    const valorB = b.cells[indiceColumna].textContent.trim()

    // Intentar comparación numérica
    const numA = Number.parseFloat(valorA)
    const numB = Number.parseFloat(valorB)

    if (!isNaN(numA) && !isNaN(numB)) {
      return esAscendente ? numA - numB : numB - numA
    }

    // Comparación de texto
    return esAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
  })

  // Reordenar filas en la tabla
  filas.forEach((fila) => cuerpoTabla.appendChild(fila))

  mostrarMensaje(`Tabla ordenada por ${encabezado.textContent.replace("↕", "").trim()}`)
}

// Función para mostrar mensajes temporales
function mostrarMensaje(mensaje) {
  // Crear elemento de mensaje si no existe
  let elementoMensaje = document.getElementById("mensajeTemporal")
  if (!elementoMensaje) {
    elementoMensaje = document.createElement("div")
    elementoMensaje.id = "mensajeTemporal"
    elementoMensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #17a2b8;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `
    document.body.appendChild(elementoMensaje)
  }

  elementoMensaje.textContent = mensaje

  // Mostrar mensaje
  setTimeout(() => {
    elementoMensaje.style.opacity = "1"
    elementoMensaje.style.transform = "translateX(0)"
  }, 10)

  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    elementoMensaje.style.opacity = "0"
    elementoMensaje.style.transform = "translateX(100%)"
  }, 3000)
}

// Funciones adicionales para simular funcionalidad completa

// Función para manejar cambios en selectores de estado
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("selector-estado")) {
    const nuevoEstado = e.target.value
    mostrarMensaje(`Estado actualizado a: ${nuevoEstado}`)
  }
})

// Función para manejar paginación
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("boton-pagina")) {
    const paginaActual = document.querySelector(".boton-pagina.activo")
    if (paginaActual) {
      paginaActual.classList.remove("activo")
    }
    e.target.classList.add("activo")
    mostrarMensaje(`Navegando a página ${e.target.textContent}`)
  }
})

// Función para manejar cambios en selector de mostrar
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("selector-mostrar")) {
    const cantidad = e.target.value
    mostrarMensaje(`Mostrando ${cantidad} registros por página`)
  }
})

// Validación de formularios
document.addEventListener(
  "blur",
  (e) => {
    if (e.target.classList.contains("campo-entrada-tabla")) {
      validarCampo(e.target)
    }
  },
  true,
)

function validarCampo(campo) {
  const valor = campo.value.trim()
  const esRequerido = campo.hasAttribute("required")

  // Remover clases de validación previas
  campo.classList.remove("campo-valido", "campo-invalido")

  if (esRequerido && !valor) {
    campo.classList.add("campo-invalido")
    return false
  }

  // Validaciones específicas por tipo
  if (campo.type === "email" && valor) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(valor)) {
      campo.classList.add("campo-invalido")
      return false
    }
  }

  if (campo.type === "tel" && valor) {
    const telefonoRegex = /^[\d\s\-+$$$$]+$/
    if (!telefonoRegex.test(valor)) {
      campo.classList.add("campo-invalido")
      return false
    }
  }

  if (valor) {
    campo.classList.add("campo-valido")
  }

  return true
}

// Función para guardar estudiante (simulada)
function guardarEstudiante() {
  const campos = document.querySelectorAll(".campo-entrada-tabla[required], .selector-campo-tabla[required]")
  let formularioValido = true

  // Basic validation for required fields
  const camposRequeridos = [
    "primerNombre",
    "primerApellido",
    "celular",
    "correoElectronico",
    "gradoEstudiante",
    "grupoEstudiante",
  ]

  camposRequeridos.forEach((campoId) => {
    const campo = document.getElementById(campoId)
    if (campo && !campo.value.trim()) {
      campo.classList.add("campo-invalido")
      formularioValido = false
    } else if (campo) {
      campo.classList.remove("campo-invalido")
      campo.classList.add("campo-valido")
    }
  })

  if (formularioValido) {
    mostrarMensaje("Estudiante guardado correctamente")
    setTimeout(() => {
      cambiarSeccion("estudiantes")
    }, 1500)
  } else {
    mostrarMensaje("Por favor, complete todos los campos requeridos")
  }
}

// Agregar estilos CSS adicionales para validación
const estilosValidacion = document.createElement("style")
estilosValidacion.textContent = `
    .campo-valido {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2) !important;
    }
    
    .campo-invalido {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
    }
    
    .encabezado-tabla.ordenado-asc .icono-ordenar::after {
        content: ' ↑';
    }
    
    .encabezado-tabla.ordenado-desc .icono-ordenar::after {
        content: ' ↓';
    }
`
document.head.appendChild(estilosValidacion)

console.log("Sistema QUIPUX inicializado correctamente")
