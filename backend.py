from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Configuración de la base de datos
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Crear tabla si no existe
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            cantidad INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Ruta principal
@app.route('/')
def index():
    return render_template('index.html')

# API productos
@app.route('/productos', methods=['GET', 'POST', 'PUT', 'DELETE'])
def productos():
    conn = get_db_connection()
    
    if request.method == 'GET':
        productos = conn.execute('SELECT * FROM productos').fetchall()
        conn.close()
        return jsonify([dict(row) for row in productos])
        
    elif request.method == 'POST':
        data = request.get_json()
        conn.execute('INSERT INTO productos (nombre, precio, cantidad) VALUES (?, ?, ?)',
                    (data['nombre'], data['precio'], data['cantidad']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Producto creado'}), 201
        
    elif request.method == 'PUT':
        data = request.get_json()
        conn.execute('UPDATE productos SET nombre=?, precio=?, cantidad=? WHERE id=?',
                    (data['nombre'], data['precio'], data['cantidad'], data['id']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Producto actualizado'})
        
    elif request.method == 'DELETE':
        id = request.args.get('id')
        conn.execute('DELETE FROM productos WHERE id=?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Producto eliminado'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)