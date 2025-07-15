/**
 * @author: Yuri Villegas
 * Simulacion de carrito de compras de un restaurant marroquí de productos y comida
 * El carrito estara integrado con componentes bootstrap
 */

let carrito = [];
const itemsCarrito = document.getElementById('items-carrito');
let productoPendiente = null; // temporal para guardar el producto
cargarCarritoDesdeLocalStorage();

function confirmarAgregarCarrito(nombre, precio) {
  // Guarda los datos del producto a agregar
  productoPendiente = { nombre, precio };

  //Modal
  document.getElementById('mensajeConfirmacion').textContent =
    `¿Estás seguro de agregar "${nombre}" al carrito?`;

  // Muestra el modal
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmar'));
  modal.show();
}


document.getElementById('btnConfirmarAccion').addEventListener('click', () => {
  if (productoPendiente) {
    const { nombre, precio } = productoPendiente;
    carrito.push({ nombre, precio });
    mostrarAlerta(`"${nombre}" fue agregado al carrito.`, 'success');
   
   guardarCarritoEnLocalStorage();
   actualizarCarrito();

    productoPendiente = null;
  }

  // Oculta el modal manualmente
  const modalElement = document.getElementById('modalConfirmar');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
});




function actualizarCarrito() {
  // Vaciar lista
  itemsCarrito.innerHTML = '';

  // Generar lista
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    li.innerHTML = `
  <div>
    ${item.nombre}
    <span class="text-muted ms-2">$${item.precio.toFixed(2)}</span>
  </div>
  <button class="btn btn-sm btn-danger eliminar-producto" onclick="eliminarProductoCarrito('${item.nombre}')">&times;</button>
`;

    itemsCarrito.appendChild(li);
  });

  var total = carrito.reduce((totalCarrito, item) => totalCarrito + item.precio, 0);
  document.getElementById('total').textContent = `$${total.toFixed(2)} MXN`;

}


function obtenerProductoPorNombre(nombreProducto) {

  return carrito.findIndex(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());
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

function mostrarAlerta(mensaje, tipo = 'info') {
  const alertasDiv = document.getElementById('alertas');

  // Crea un div con las clases de Bootstrap para alertas
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.role = 'alert';
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;

  // Agrega la alerta al contenedor
  alertasDiv.appendChild(alerta);

  // Elimina la alerta después de unos segundos
  setTimeout(() => {
    alerta.classList.remove('show');
    alerta.classList.add('hide');
    setTimeout(() => alertasDiv.removeChild(alerta), 300);
  }, 3000);
}

function cargarCarritoDesdeLocalStorage() {
  const datos = localStorage.getItem('carrito');
  if (datos) {
    carrito = JSON.parse(datos);
    actualizarCarrito(); // repinta el carrito
  }
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function finalizarCompra() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  actualizarCarrito();
  mostrarAlerta('¡Gracias por tu compra!', 'success');
}
