"use client";


import { useEffect, useState } from 'react';
import './Home.css';

type Product = {
  id: string;
  title: string;
  price: number;
  available_quantity: number;
  thumbnail: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><img src={p.thumbnail} alt={p.title} width={50} /></td>
                  <td>{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.available_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
