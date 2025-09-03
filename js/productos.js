import { confirmarAgregarCarrito } from './ui.js';
import { mostrarAlerta } from './ui.js';

export function cargarProductosDesdeJSON() {
  fetch('../pages/resources/productos.json')
    .then(res => res.ok ? res.json() : Promise.reject('Error al cargar productos'))
    .then(productos => renderizarProductos(productos))
    .catch(err => {
      console.error(err);
      mostrarAlerta('No se pudieron cargar los productos.', 'danger');
    });
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = productos.map(prod => `
    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">$${prod.precio} MXN</p>
          <button class="btn btn-primary btn-agregar" data-nombre="${prod.nombre}" data-precio="${prod.precio}">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `).join('');

  contenedor.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);
      confirmarAgregarCarrito(nombre, precio);
    });
  });
}