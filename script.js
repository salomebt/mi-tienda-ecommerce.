const productos = [
  { id: 1, nombre: "Gallina Crochet", precio: 25.00, imagen: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfxvvBWT32PWMJs6cH9dDHbekTl3qGZ_6SYJuq5j4yuXUwJAlTbu754C5RpiKBXZcsmYGRyCblVDpkCP3KcpSVkENDm0lPqEKX2wP8LZrCyHkXjOUWZH4an_3eu-8lEwjDkcS8-_CGBVQ/s1600/gallina+huevos.jpg", categoria: "Gallinas" },
  { id: 2, nombre: "Gato Dormilón", precio: 20.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9U1lWKTJIu5-7Sx4wLDNBG9AJ8xAtZZ8Vqg&s", categoria: "Gatos" },
  { id: 3, nombre: "Gato Feliz", precio: 20.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIS0tYp49_Pm1uD5cFAmhtocKwfus_AXcURQ&s", categoria: "Gatos" },
  { id: 4, nombre: "Pollito", precio: 25.00, imagen: "https://i.pinimg.com/736x/89/ef/26/89ef268e310352d4428be19ccbbeb7fc.jpg", categoria: "Gallinas" },
  { id: 5, nombre: "Gallo", precio: 25.00, imagen: "https://i0.wp.com/copitohechoamano.com/wp-content/uploads/2022/07/IMG_1098-scaled.jpeg?fit=2560%2C2560&ssl=1", categoria: "Gallinas" },
];

let carrito = [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad");

function mostrarProductos(filtrados = productos) {
  contenedorProductos.innerHTML = "";
  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function filtrarPorCategoria() {
  const categoria = document.getElementById("categoria").value;
  if (categoria === "todos") {
    mostrarProductos();
  } else {
    const filtrados = productos.filter(p => p.categoria === categoria);
    mostrarProductos(filtrados);
  }
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(item => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let totalCantidad = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    totalCantidad += item.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
  cantidadCarrito.textContent = totalCantidad;
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    alert("🧺 El carrito ya está vacío.");
    return;
  }
  carrito = [];
  actualizarCarrito();
  alert("🧼 ¡Carrito vaciado con éxito!");
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("❗ Tu carrito está vacío.");
  } else {
    alert("🎉 ¡Gracias por tu compra de peluches!");
    vaciarCarrito();
  }
}

paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalCarrito.textContent
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert(`🎉 Pago realizado con éxito por ${details.payer.name.given_name}`);
      vaciarCarrito();
    });
  }
}).render('#paypal-button-container');

mostrarProductos();