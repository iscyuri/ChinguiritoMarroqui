import { carrito, guardarCarritoEnLocalStorage } from './carrito.js';
import { actualizarCarrito, mostrarAlerta } from './ui.js';

export function mostrarResumenCheckout() {
  if (carrito.length === 0) {
    mostrarAlerta('Tu carrito está vacío.', 'warning');
    return;
  }

  const listaResumen = document.getElementById('listaResumen');
  const totalResumen = document.getElementById('totalResumen');
  listaResumen.innerHTML = '';

  let total = 0;
  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    listaResumen.insertAdjacentHTML('beforeend', `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div><strong>${producto.nombre}</strong> x${producto.cantidad}</div>
        <span class="text-muted">$${subtotal.toFixed(2)} MXN</span>
      </li>
    `);
  });

  totalResumen.innerHTML = `$${total.toFixed(2)} MXN`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalResumenCompra')).show();
}

export function confirmarPedido() {
  if (carrito.length === 0) {
    mostrarAlerta('Tu carrito está vacío.', 'danger');
    return;
  }

  carrito.length = 0;
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  mostrarAlerta('¡Gracias por tu compra! Tu pedido fue confirmado y está en camino.', 'success');

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalResumenCompra'));
  if (modal) modal.hide();
}