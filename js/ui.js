import { carrito, obtenerProductoPorNombre, guardarCarritoEnLocalStorage, eliminarProductoCarrito, modificarCantidad } from './carrito.js';
import { Producto } from './producto.js';
import { mostrarResumenCheckout } from './checkout.js';

let productoPendiente = null;

export function actualizarCarrito() {
  const itemsCarrito = document.getElementById('items-carrito');
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

  itemsCarrito.querySelectorAll('.btn-sumar').forEach(btn =>
    btn.addEventListener('click', () => modificarCantidad(btn.dataset.nombre, 1))
  );
  itemsCarrito.querySelectorAll('.btn-restar').forEach(btn =>
    btn.addEventListener('click', () => modificarCantidad(btn.dataset.nombre, -1))
  );
  itemsCarrito.querySelectorAll('.eliminar-producto').forEach(btn =>
    btn.addEventListener('click', () => eliminarProductoCarrito(btn.dataset.nombre))
  );

  actualizarContadorCarrito();
  actualizarBotonCompra();
  actualizarTotalCarrito();
}

export function confirmarAgregarCarrito(nombre, precio) {
  const index = obtenerProductoPorNombre(nombre);
  if (index !== -1) {
    carrito[index].cantidad += 1;
    mostrarAlerta(`Se aumentó la cantidad de "${nombre}" en el carrito.`, 'info');
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    return;
  }

  productoPendiente = new Producto(nombre, precio);
  const mensaje = document.getElementById('mensajeConfirmacion');
  if (mensaje) {
    mensaje.innerHTML = `¿Estás seguro de agregar <strong>${productoPendiente.nombre}</strong> al carrito?`;
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmar')).show();
}

export function agregarProductoPendiente() {
  if (!productoPendiente) return;

  carrito.push(productoPendiente);
  mostrarAlerta(`"${productoPendiente.nombre}" fue agregado al carrito.`, 'success');
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  productoPendiente = null;

  bootstrap.Modal.getInstance(document.getElementById('modalConfirmar')).hide();
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count');
  if (contador) {
    contador.innerHTML = `<span class="badge bg-primary">${carrito.length}</span>`;
  }
}

function actualizarBotonCompra() {
  const btn = document.getElementById('btnFinalizarCompra');
  if (btn) {
    btn.disabled = carrito.length === 0;
  }
}

function actualizarTotalCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalElemento = document.getElementById('total');
  if (totalElemento) {
    totalElemento.innerHTML = `<strong>Total:</strong> <span class="text-success">$${total.toFixed(2)} MXN</span>`;
  }
}

export function mostrarAlerta(mensaje, tipo = 'info') {
  const alertasDiv = document.getElementById('alertas');
  if (!alertasDiv) return;

  alertasDiv.insertAdjacentHTML('beforeend', `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `);

  const alerta = alertasDiv.lastElementChild;
  setTimeout(() => {
    alerta.classList.remove('show');
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.parentNode.removeChild(alerta);
      }
    }, 300);
  }, 3000);
}