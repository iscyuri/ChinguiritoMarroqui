

let carrito = [];
const itemsCarrito = document.getElementById('items-carrito');



function agregarCarrito() {
  alert("Agregando al carrito");

  let nombre = "Producto ejemplo";
  let precio = 5.5;

  carrito.push({ nombre, precio });

  muestraProductosCarrito();
  actualizarCarrito();
}


function muestraProductosCarrito() {
  for (let index = 0; index < carrito.length; index++) {
    console.log(carrito[index]);
  }

}

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

}


function obtenerProductoPorNombre(nombreProducto) {
  return carrito.findIndex(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());
}


function eliminarProductoCarrito(nombreProducto) {
  const indice = obtenerProductoPorNombre(nombreProducto);

  if (indice !== -1) {
    console.log("El producto " + carrito[indice].nombre + " se eliminara");
    carrito.splice(indice, 1);

    return true;
  } else {
    return false;
  }

  actualizarCarrito();
}