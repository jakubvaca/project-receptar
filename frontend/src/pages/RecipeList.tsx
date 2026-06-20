import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types';

export default function RecipeList() {
  // Stavy pro uložení dat, stavu načítání a případné chyby
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect se spustí pouze jednou po prvním vykreslení stránky (díky prázdnému poli [] na konci)
  useEffect(() => {
    fetch('http://localhost:8080/api/recipes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Nepodařilo se připojit k serveru. Běží Spring Boot?');
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Co se má zobrazit, když se na data čeká
  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-xl">Načítám recepty z databáze...</div>;
  }

  // Pomocná funkce pro získání CSRF tokenu
  const getCsrfToken = () => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    return match ? match[2] : null;
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Opravdu chcete tento recept smazat?')) return;

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {};
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    }

    fetch(`http://localhost:8080/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Nepodařilo se smazat recept. Možná nejste autorem.');
        }
        setRecipes(recipes.filter((r) => r.id !== id));
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const currentUser = localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser') as string) : null;

  // Co se má zobrazit, když spadne spojení
  if (error) {
    return <div className="p-8 text-center text-red-500 font-bold text-xl">Chyba: {error}</div>;
  }

  // Hlavní vykreslení, když data úspěšně dorazí
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Všechny recepty</h1>
      
      {recipes.length === 0 ? (
        <p className="text-gray-600 text-lg">Zatím tu nejsou žádné recepty. Běž nějaký přidat!</p>
      ) : (
        // Grid rozdělí karty receptů do sloupců podle velikosti obrazovky
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            // Každá karta s receptem
            <div key={recipe.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-orange-600 mb-2">{recipe.title}</h2>
              <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">Od: {recipe.authorName}</p>
              
              <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Suroviny:</h3>
              <ul className="list-disc list-inside mb-4 text-gray-600 text-sm">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index}>
                    {ing.name} <span className="text-gray-400">({ing.amount} {ing.unit})</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Postup:</h3>
              <p className="text-gray-600 text-sm mb-4">{recipe.instructions}</p>

              {currentUser && currentUser.username === recipe.authorName && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/edit/${recipe.id}`}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition"
                  >
                    Upravit
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded transition"
                  >
                    Smazat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}