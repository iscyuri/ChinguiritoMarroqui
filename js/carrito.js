/**
 * @author: Yuri Villegas
 * Simulacion de carrito de compras de un restaurant marroquí de productos y comida
 * El carrito estara integrado con componentes bootstrap
 */

class Producto {
  constructor(nombre, precio, cantidad = 1) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}


let carrito = [];
const itemsCarrito = document.getElementById('items-carrito');
let productoPendiente = null; // temporal para guardar el producto

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDesdeJSON();
  cargarCarritoDesdeLocalStorage();
  

  const btnFinalizar = document.getElementById('btnFinalizarCompra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarCompra);
  }

});


function cargarProductosDesdeJSON() {
  fetch('../pages/resources/productos.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar productos');
      return response.json();
    })
    .then(productos => {
      const contenedor = document.getElementById('productos');
      contenedor.innerHTML = productos.map(prod => `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">$${prod.precio} MXN</p>
              <button class="btn btn-primary" onclick="confirmarAgregarCarrito('${prod.nombre}', ${prod.precio})">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error(error);
      mostrarAlerta('No se pudieron cargar los productos.', 'danger');
    });
}

function crearAlertaHTML(mensaje, tipo = 'info') {
  return `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function mostrarAlerta(mensaje, tipo = 'info') {
  const alertasDiv = document.getElementById('alertas');
  alertasDiv.insertAdjacentHTML('beforeend', crearAlertaHTML(mensaje, tipo));

  const alerta = alertasDiv.lastElementChild;
  setTimeout(() => {
    alerta.classList.remove('show');
    setTimeout(() => alertasDiv.removeChild(alerta), 300);
  }, 3000);
}

function obtenerProductoPorNombre(nombreProducto) {

  return carrito.findIndex(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


function eliminarProductoCarrito(nombreProducto) {
  const indice = obtenerProductoPorNombre(nombreProducto);


  if (indice !== -1) {


    mostrarAlerta(`"${carrito[indice].nombre}" fue eliminado del carrito.`, 'warning');

    carrito.splice(indice, 1);

    guardarCarritoEnLocalStorage();
    actualizarCarrito();


    return true;
  } else {

    mostrarAlerta(`No se encontró el producto "${nombreProducto}" en el carrito.`, 'danger');

    return false;
  }


}

function confirmarAgregarCarrito(nombre, precio) {
  const index = obtenerProductoPorNombre(nombre);

  if (index !== -1) {
    carrito[index].cantidad += 1;
    mostrarAlerta(`Se aumentó la cantidad de "${nombre}" en el carrito.`, 'info');
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    return;
  }

  productoPendiente = new Producto(nombre, precio);
  document.getElementById('mensajeConfirmacion').textContent =
    `¿Estás seguro de agregar "${productoPendiente.nombre}" al carrito?`;

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmar'));
  modal.show();
}


document.getElementById('btnConfirmarAccion').addEventListener('click', () => {
  const modalElement = document.getElementById('modalConfirmar');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  if (productoPendiente) {
    const { nombre, precio } = productoPendiente;
    carrito.push(new Producto(nombre, precio));

    mostrarAlerta(`"${nombre}" fue agregado al carrito.`, 'success');
    guardarCarritoEnLocalStorage();
    actualizarCarrito();

    productoPendiente = null;
  }

  // Cierra el modal inmediatamente
  modalInstance.hide();
});


function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count');
  contador.textContent = carrito.length;
}

function actualizarBotonCompra() {
  const btn = document.getElementById('btnFinalizarCompra');
  btn.disabled = carrito.length === 0;
}

function modificarCantidad(nombreProducto, cambio) {
  const index = obtenerProductoPorNombre(nombreProducto);
  if (index !== -1) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
      eliminarProductoCarrito(nombreProducto);
    } else {
      guardarCarritoEnLocalStorage();
      actualizarCarrito();
    }
  }
}


function actualizarCarrito() {
  itemsCarrito.innerHTML = carrito.map(item => `
    <li class="list-group-item d-flex justify-content-between align-items-center">

      <div>
        ${item.nombre}
        <span class="text-muted ms-2">x ${item.cantidad}</span>
        <span class="text-muted ms-2">$${(item.precio * item.cantidad).toFixed(2)}</span>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-1 btn-restar" data-nombre="${item.nombre}">–</button>
        <button class="btn btn-sm btn-outline-primary me-1 btn-sumar" data-nombre="${item.nombre}">+</button>
        <button class="btn btn-sm btn-danger eliminar-producto" data-nombre="${item.nombre}">×</button>
      </div>
    </li>
  `).join('');

 
  itemsCarrito.querySelectorAll('.btn-sumar').forEach(btn => {
    btn.addEventListener('click', () => modificarCantidad(btn.dataset.nombre, 1));
  });

  itemsCarrito.querySelectorAll('.btn-restar').forEach(btn => {
    btn.addEventListener('click', () => modificarCantidad(btn.dataset.nombre, -1));
  });

  itemsCarrito.querySelectorAll('.eliminar-producto').forEach(btn => {
    btn.addEventListener('click', () => eliminarProductoCarrito(btn.dataset.nombre));
  });

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById('total').textContent = `$${total.toFixed(2)} MXN`;

  actualizarContadorCarrito();
  actualizarBotonCompra();
}

function cargarCarritoDesdeLocalStorage() {
  const datos = localStorage.getItem('carrito');
  if (datos) {
    const objetosCargados = JSON.parse(datos);
    carrito = objetosCargados.map(obj => new Producto(obj.nombre, obj.precio));
    actualizarCarrito();
  }
}
function finalizarCompra() {
  if (carrito.length == 0) {
    mostrarAlerta('¡No hay productos por comprar!', 'danger');
    return;
  }

  carrito = [];

  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  actualizarContadorCarrito();
  mostrarAlerta('¡Gracias por tu compra!', 'success');

}
