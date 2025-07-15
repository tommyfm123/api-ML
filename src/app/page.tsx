"use client";


import { useEffect, useState } from 'react';
import './Home.css';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  price: number;
  available_quantity: number;
  thumbnail: string;
  description: string;
};


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: 0,
    available_quantity: 0,
  });

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/ml/products/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      console.error('Delete failed');
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      title: p.title,
      description: p.description,
      price: p.price,
      available_quantity: p.available_quantity,
    });
  };

  const cancelEdit = () => setEditingProduct(null);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const res = await fetch('/api/ml/products/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingProduct.id, ...editForm }),
    });

    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editForm } : p))
      );
      setEditingProduct(null);
    } else {
      console.error('Edit failed');
    }
  };

  useEffect(() => {
    // Intentamos obtener productos automáticamente al cargar
    fetch('/api/ml/products')
      .then(res => {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
          return null;
        }
        setIsAuthenticated(true);
        return res.json();
      })
      .then(data => {
        if (data?.results) {
          setProducts(data.results);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="home-container">
      <h1 className="home-title">Conectar con MercadoLibre</h1>
      {!isAuthenticated && (
        <a href="/api/ml/login" className="ml-button">
          Iniciar sesión con MercadoLibre
        </a>
      )}

      <div className="product-box">
        {loading ? (
          <p>Cargando...</p>
        ) : !isAuthenticated ? (
          <p>Iniciá sesión para ver tus productos.</p>
        ) : products.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Descripción</th> {/* Nueva columna */}
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <Image src={p.thumbnail} alt={p.title} width={50} height={50} />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.description || '—'}</td> {/* Nueva celda */}
                  <td>${p.price}</td>
                  <td>{p.available_quantity}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => startEdit(p)}
                    >
                      Editar
                    </button>{' '}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editingProduct && (
        <form className="edit-form" onSubmit={submitEdit}>
          <h3>Editar Producto</h3>
          <label>
            Título
            <input
              name="title"
              value={editForm.title}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Precio
            <input
              type="number"
              name="price"
              value={editForm.price}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              name="available_quantity"
              value={editForm.available_quantity}
              onChange={handleFormChange}
            />
          </label>
          <div>
            <button type="submit" className="save-button">
              Guardar
            </button>
            <button type="button" onClick={cancelEdit} className="cancel-button">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}