'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ItemsPage() {
  const search = useSearchParams();
  const token = search.get('access_token');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/ml/items?access_token=${token}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <p>No access token provided.</p>;
  if (loading) return <p>Cargando...</p>;
  if (!data) return <p>Sin datos</p>;

  return (
    <main>
      <h1>Productos</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.items.results.map((id: string) => (
            <tr key={id}>
              <td>{id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
