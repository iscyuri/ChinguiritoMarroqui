export class Producto {
  constructor(nombre, precio, cantidad = 1) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}