// Funciones principales
async function cargarProductos() {
    const response = await fetch('/productos');
    const productos = await response.json();
    const tbody = document.querySelector('#productosTable tbody');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        tbody.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <button onclick="editarProducto(${producto.id})" class="btn-primary">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})" class="btn-primary">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function guardarProducto(event) {
    event.preventDefault();
    
    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
    };
    
    const id = document.getElementById('productoId').value;
    const method = id ? 'PUT' : 'POST';
    if (id) producto.id = id;
    
    await fetch('/productos', {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });
    
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    cargarProductos();
}

async function editarProducto(id) {
    const response = await fetch(`/productos?id=${id}`);
    const productos = await response.json();
    const producto = productos.find(p => p.id === id);
    
    document.getElementById('productoId').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('cantidad').value = producto.cantidad;
}

async function eliminarProducto(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        await fetch(`/productos?id=${id}`, {
            method: 'DELETE'
        });
        cargarProductos();
    }
}

// Eventos
document.getElementById('productoForm').addEventListener('submit', guardarProducto);
window.addEventListener('load', cargarProductos);