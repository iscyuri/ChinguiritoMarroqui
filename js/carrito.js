

let carrito = [];
const itemsCarrito = document.getElementById('items-carrito');



function agregarCarrito(nombre,precio) {
  
  const confirmar = confirm(`¿Estás seguro de agregar "${nombre}" al carrito?`);

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

  console.log("Se ha encontrado el " + carrito[indice].nombre + " en la posicion " + indice);
  

  if (indice !== -1) {
    console.log("El producto " + carrito[indice].nombre + " se eliminara");
    carrito.splice(indice, 1);

    actualizarCarrito();

    return true;
  } else {

    console.log("El producto " + carrito[indice].nombre + " no se encontro");
    return false;
  }

  
}