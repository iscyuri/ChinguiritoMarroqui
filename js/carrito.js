/**
 * @author: Yuri Villegas
 * Simulacion de carrito de compras de un restaurant marroquí de productos y comida
 * El carrito estara integrado con componentes bootstrap
 */

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}


let carrito = [];
const itemsCarrito = document.getElementById('items-carrito');
let productoPendiente = null; // temporal para guardar el producto
cargarCarritoDesdeLocalStorage();

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
  // Crea una instancia de Producto
  productoPendiente = new Producto(nombre, precio);

  // Actualiza el texto del modal
  document.getElementById('mensajeConfirmacion').textContent =
    `¿Estás seguro de agregar "${productoPendiente.nombre}" al carrito?`;

  // Muestra el modal
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmar'));
  modal.show();
}


document.getElementById('btnConfirmarAccion').addEventListener('click', () => {
  if (productoPendiente) {
    const { nombre, precio } = productoPendiente;
    const nuevoProducto = new Producto(nombre, precio);
    carrito.push(nuevoProducto);

    mostrarAlerta(`"${nombre}" fue agregado al carrito.`, 'success');
    guardarCarritoEnLocalStorage();
    actualizarCarrito();

    productoPendiente = null;
  }

  const modalElement = document.getElementById('modalConfirmar');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
});


function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count');
  contador.textContent = carrito.length;
}


function actualizarCarrito() {
  // Vaciar lista
  itemsCarrito.innerHTML = '';

  // Generar lista
  carrito.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    const div = document.createElement('div');
    div.textContent = item.nombre;

    const span = document.createElement('span');
    span.classList.add('text-muted', 'ms-2');
    span.textContent = `$${item.precio.toFixed(2)}`;

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-sm', 'btn-danger', 'eliminar-producto');
    btn.textContent = '×';
    btn.addEventListener('click', () => eliminarProductoCarrito(item.nombre));

    div.appendChild(span);
    li.appendChild(div);
    li.appendChild(btn);
    itemsCarrito.appendChild(li);
  });

  var total = carrito.reduce((totalCarrito, item) => totalCarrito + item.precio, 0);
  document.getElementById('total').textContent = `$${total.toFixed(2)} MXN`;

  actualizarContadorCarrito();


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
