function obtenerProductos() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', './js/productos.json', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject('Error al cargar los productos.');
            }
        };
        xhr.onerror = function () {
            reject('Error de red.');
        };
        xhr.send();
    });
}

function renderizarProductos(productos) {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = '';
    productos.forEach((producto) => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto');
        productoElement.setAttribute('data-nombre', producto.nombre);
        productoElement.innerHTML = `
            <h3>${producto.nombre}</h3>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>Precio: $${producto.precio}</p>
            <button class="agregar-al-carrito" data-precio="${producto.precio}">Agregar al Carrito</button>
        `;
        catalogo.appendChild(productoElement);
    });
    agregarEventosCarrito();
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');
    productos.forEach((producto) => {
        const nombre = producto.getAttribute('data-nombre').toLowerCase();
        if (nombre.includes(searchInput)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    filterProducts();
}

let contadorCarrito = 0;
let totalCarrito = 0;
const contadorCarritoElement = document.getElementById('contador-carrito');
const listaCarritoElement = document.getElementById('lista-carrito');
const totalCarritoElement = document.getElementById('total-carrito');

function agregarEventosCarrito() {
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
        button.addEventListener('click', () => {
            const precio = parseFloat(button.getAttribute('data-precio'));
            const nombreProducto = button.parentElement.querySelector('h3').textContent;
            contadorCarrito++;
            totalCarrito += precio;
            contadorCarritoElement.textContent = contadorCarrito;
            totalCarritoElement.textContent = totalCarrito.toFixed(2);
            const itemCarrito = document.createElement('li');
            itemCarrito.classList.add('carrito-item');
            itemCarrito.innerHTML = `${nombreProducto} - $${precio.toFixed(2)} <span class="eliminar">X</span>`;
            listaCarritoElement.appendChild(itemCarrito);
            itemCarrito.querySelector('.eliminar').addEventListener('click', () => {
                listaCarritoElement.removeChild(itemCarrito);
                contadorCarrito--;
                totalCarrito -= precio;
                contadorCarritoElement.textContent = contadorCarrito;
                totalCarritoElement.textContent = totalCarrito.toFixed(2);
            });
        });
    });
}

function guardarCarrito() {
    const carrito = {
        contadorCarrito,
        totalCarrito,
        items: Array.from(listaCarritoElement.children).map(item => ({
            nombre: item.textContent.split(' - ')[0],
            precio: parseFloat(item.textContent.split(' - $')[1].split(' ')[0])
        }))
    };
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function guardarCarrito() {
    const carrito = {
        contadorCarrito,
        totalCarrito,
        items: Array.from(listaCarritoElement.children).map(item => ({
            nombre: item.textContent.split(' - ')[0],
            precio: parseFloat(item.textContent.split(' - $')[1].split(' ')[0])
        }))
    };
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
        contadorCarrito = carritoGuardado.contadorCarrito;
        totalCarrito = carritoGuardado.totalCarrito;
        carritoGuardado.items.forEach(item => {
            const itemCarrito = document.createElement('li');
            itemCarrito.classList.add('carrito-item');
            itemCarrito.innerHTML = `${item.nombre} - $${item.precio.toFixed(2)} <span class="eliminar">X</span>`;
            listaCarritoElement.appendChild(itemCarrito);
            itemCarrito.querySelector('.eliminar').addEventListener('click', () => {
                listaCarritoElement.removeChild(itemCarrito);
                contadorCarrito--;
                totalCarrito -= item.precio;
                contadorCarritoElement.textContent = contadorCarrito;
                totalCarritoElement.textContent = totalCarrito.toFixed(2);
                guardarCarrito();
            });
        });
        contadorCarritoElement.textContent = contadorCarrito;
        totalCarritoElement.textContent = totalCarrito.toFixed(2);
    }
}

function agregarEventosCarrito() {
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
        button.addEventListener('click', () => {
            const precio = parseFloat(button.getAttribute('data-precio'));
            const nombreProducto = button.parentElement.querySelector('h3').textContent;
            contadorCarrito++;
            totalCarrito += precio;
            contadorCarritoElement.textContent = contadorCarrito;
            totalCarritoElement.textContent = totalCarrito.toFixed(2);
            const itemCarrito = document.createElement('li');
            itemCarrito.classList.add('carrito-item');
            itemCarrito.innerHTML = `${nombreProducto} - $${precio.toFixed(2)} <span class="eliminar">X</span>`;
            listaCarritoElement.appendChild(itemCarrito);
            itemCarrito.querySelector('.eliminar').addEventListener('click', () => {
                listaCarritoElement.removeChild(itemCarrito);
                contadorCarrito--;
                totalCarrito -= precio;
                contadorCarritoElement.textContent = contadorCarrito;
                totalCarritoElement.textContent = totalCarrito.toFixed(2);
                guardarCarrito();
            });
            guardarCarrito();
        });
    });
}

cargarCarrito();

const searchInputElement = document.getElementById('searchInput');
const clearTextElement = document.getElementById('clearText');

searchInputElement.addEventListener('input', () => {
    if (searchInputElement.value.length > 0) {
        clearTextElement.style.visibility = 'visible';
    } else {
        clearTextElement.style.visibility = 'hidden';
    }
});

searchInputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterProducts();
    }
});

document.getElementById('searchButton').addEventListener('click', filterProducts);

clearTextElement.addEventListener('click', clearSearch);

obtenerProductos()
    .then(productos => {
        renderizarProductos(productos);
    })
    .catch(error => {
        console.error(error);
    });

const finalizarCompraBtn = document.getElementById('finalizar-compra');

document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (contadorCarrito === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tu carrito está vacío. ¡Agrega productos antes de finalizar la compra!',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: '¡Compra finalizada!',
            text: 'Gracias por tu compra. Tu pedido ha sido registrado.',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                contadorCarrito = 0;
                totalCarrito = 0;
                listaCarritoElement.innerHTML = '';
                contadorCarritoElement.textContent = contadorCarrito;
                totalCarritoElement.textContent = totalCarrito.toFixed(2);
            }
        });
    }
});