// Importación de módulos necesarios
import { cargarProductosDesdeJSON } from './productos.js';
import { cargarCarritoDesdeLocalStorage } from './carrito.js';
import { mostrarResumenCheckout, confirmarPedido } from './checkout.js';
import { agregarProductoPendiente } from './ui.js';

/**
 * Inicializa la carga de productos, el carrito desde localStorage,
 * y asigna los eventos a los botones principales.
 */
document.addEventListener('DOMContentLoaded', () => {
  cargarCarritoDesdeLocalStorage();

  cargarProductosDesdeJSON();

  const btnFinalizar = document.getElementById('btnFinalizarCompra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', mostrarResumenCheckout);
  }

  const btnConfirmar = document.getElementById('btnConfirmarPedido');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', confirmarPedido);
  }

  const btnConfirmarAccion = document.getElementById('btnConfirmarAccion');
  if (btnConfirmarAccion) {
    btnConfirmarAccion.addEventListener('click', agregarProductoPendiente);
  }
});