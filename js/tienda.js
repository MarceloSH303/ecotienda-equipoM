// TODO: arreglo de productos, funciones, catalogo, filtros, buscador y carrito
// ===== Datos: arreglo de objetos literales (8 productos, 4 categorías) =====
const productos = [
  {
    nombre: "Bombillo LED 9 W",
    categoria: "iluminacion",
    precio: 8900,
    potenciaVieja: 60,
    potenciaNueva: 9,
    horasDia: 5,
    descripcion: "Alumbra igual que uno incandescente de 60 W y gasta mucho menos.",
    caracteristicas: ["Dura unas 15.000 horas", "Casi no se calienta", "Luz cálida o blanca"]
  },
  {
    nombre: "Bombillo LED 12 W",
    categoria: "iluminacion",
    precio: 12500,
    potenciaVieja: 100,
    potenciaNueva: 12,
    horasDia: 5,
    descripcion: "Da la luz de un bombillo de 100 W para salas y cocinas.",
    caracteristicas: ["Dura unas 15.000 horas", "Luz más potente", "Enciende al instante"]
  },
  {
    nombre: "Panel LED 18 W",
    categoria: "iluminacion",
    precio: 28000,
    potenciaVieja: 36,
    potenciaNueva: 18,
    horasDia: 6,
    descripcion: "Reemplaza el tubo fluorescente con una luz pareja y sin parpadeo.",
    caracteristicas: ["Luz uniforme", "Diseño delgado", "Sin parpadeo"]
  },
  {
    nombre: "Air fryer 1500 W",
    categoria: "cocina",
    precio: 289000,
    potenciaVieja: 2000,
    potenciaNueva: 1500,
    horasDia: 0.5,
    descripcion: "Cocina con aire caliente y sin aceite, y calienta más rápido que un horno.",
    caracteristicas: ["Cocina sin aceite", "Calienta rápido", "Fácil de limpiar"]
  },
  {
    nombre: "Olla multifuncional 1000 W",
    categoria: "cocina",
    precio: 259000,
    potenciaVieja: 1800,
    potenciaNueva: 1000,
    horasDia: 1,
    descripcion: "Cocina a presión y programable: lentejas y fríjoles en menos tiempo.",
    caracteristicas: ["Cocción a presión", "Programable", "Capacidad de 5,5 litros"]
  },
  {
    nombre: "Nevera inverter",
    categoria: "refrigeracion",
    precio: 1890000,
    potenciaVieja: 90,
    potenciaNueva: 35,
    horasDia: 24,
    descripcion: "Su compresor inverter ajusta la potencia y gasta menos que una nevera vieja.",
    caracteristicas: ["Compresor inverter", "Funciona más silenciosa", "Etiqueta energética A"]
  },
  {
    nombre: "Ventilador DC 30 W",
    categoria: "refrigeracion",
    precio: 189000,
    potenciaVieja: 60,
    potenciaNueva: 30,
    horasDia: 8,
    descripcion: "Su motor DC mueve el mismo aire con la mitad de la energía.",
    caracteristicas: ["Motor DC eficiente", "Varias velocidades", "Muy silencioso"]
  },
  {
    nombre: "Portátil eficiente 45 W",
    categoria: "oficina",
    precio: 2200000,
    potenciaVieja: 250,
    potenciaNueva: 45,
    horasDia: 6,
    descripcion: "Reemplaza un computador de escritorio: más moderno, portátil y con batería.",
    caracteristicas: ["Batería de varias horas", "Pantalla integrada", "Carga rápida"]
  }
];

// ===== Variables =====
const TARIFA = 960; // COP por kWh, tomada de mi factura de EPM
let carrito = [];
let categoriaActual = "todas";
let textoBusqueda = "";

// ===== Funciones =====
function ahorroKwhMes(producto) {
  return (producto.potenciaVieja - producto.potenciaNueva) * producto.horasDia * 30 / 1000;
}

function ahorroPesosMes(producto) {
  return ahorroKwhMes(producto) * TARIFA;
}

function formatoPesos(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CO");
}

function nombreCategoria(categoria) {
  if (categoria === "iluminacion") return "Iluminación";
  if (categoria === "cocina") return "Cocina";
  if (categoria === "refrigeracion") return "Refrigeración";
  return "Oficina";
}

function mostrarProductos() {
  let html = "";
  for (const producto of productos) {
    const coincideCategoria = categoriaActual === "todas" || producto.categoria === categoriaActual;
    const coincideTexto = producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    if (coincideCategoria && coincideTexto) {
      let caracteristicas = "";
      for (const c of producto.caracteristicas) {
        caracteristicas += `<li>${c}</li>`;
      }
      html += `
        <article class="tarjeta">
          <span class="categoria">${nombreCategoria(producto.categoria)}</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <ul>${caracteristicas}</ul>
          <p class="precio">${formatoPesos(producto.precio)}</p>
          <p>Ahorra ${ahorroKwhMes(producto).toFixed(1)} kWh al mes (${formatoPesos(ahorroPesosMes(producto))})</p>
          <button type="button" class="btn btn-success" data-indice="${productos.indexOf(producto)}">Agregar al carrito</button>
        </article>`;
    }
  }
  document.querySelector("#productos").innerHTML = html || "<p>No hay productos con ese filtro.</p>";
}

function mostrarCarrito() {
  let lista = "";
  let total = 0;
  let ahorroKwh = 0;
  let ahorroPesos = 0;
  for (const producto of carrito) {
    lista += `<li>${producto.nombre} · ${formatoPesos(producto.precio)}</li>`;
    total += producto.precio;
    ahorroKwh += ahorroKwhMes(producto);
    ahorroPesos += ahorroPesosMes(producto);
  }
  document.querySelector("#lista-carrito").innerHTML = lista || "<li>El carrito está vacío.</li>";
  document.querySelector("#total").textContent = formatoPesos(total);
  document.querySelector("#ahorro").textContent = `${ahorroKwh.toFixed(1)} kWh · ${formatoPesos(ahorroPesos)}`;
  document.querySelector("#meses").textContent =
    ahorroPesos > 0 ? `${Math.ceil(total / ahorroPesos)} meses` : "-";
}

// ===== Eventos =====
document.querySelector("#productos").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-indice]");
  if (boton) {
    carrito.push(productos[Number(boton.dataset.indice)]);
    mostrarCarrito();
  }
});

for (const boton of document.querySelectorAll(".filtro")) {
  boton.addEventListener("click", function () {
    categoriaActual = boton.dataset.categoria;
    for (const otro of document.querySelectorAll(".filtro")) {
      otro.classList.remove("activo");
    }
    boton.classList.add("activo");
    mostrarProductos();
  });
}

document.querySelector("#buscador").addEventListener("input", function (evento) {
  textoBusqueda = evento.target.value;
  mostrarProductos();
});

document.querySelector("#vaciar").addEventListener("click", function () {
  carrito = [];
  mostrarCarrito();
});

// ===== Inicio =====
mostrarProductos();
mostrarCarrito();