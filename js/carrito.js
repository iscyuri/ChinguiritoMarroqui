import { Producto } from './producto.js';
import { actualizarCarrito } from './ui.js';

export let carrito = [];

export function obtenerProductoPorNombre(nombre) {
  return carrito.findIndex(p => p.nombre.toLowerCase() === nombre.toLowerCase());
}

export function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function cargarCarritoDesdeLocalStorage() {
  const datos = localStorage.getItem('carrito');
  if (datos) {
    const objetos = JSON.parse(datos);
    carrito = objetos.map(obj => new Producto(obj.nombre, obj.precio, obj.cantidad || 1));
    actualizarCarrito();
  }
}

export function modificarCantidad(nombre, cambio) {
  const index = obtenerProductoPorNombre(nombre);
  if (index !== -1) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
      eliminarProductoCarrito(nombre);
    } else {
      guardarCarritoEnLocalStorage();
      actualizarCarrito();
    }
  }
}

export function eliminarProductoCarrito(nombre) {
  const index = obtenerProductoPorNombre(nombre);
  if (index !== -1) {
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
  }
}