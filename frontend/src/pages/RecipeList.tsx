import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Recipe, PageResponse } from '../types';

export default function RecipeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 0;

  // Stavy pro uložení dat, stavu načítání a případné chyby
  const [pageData, setPageData] = useState<PageResponse<Recipe> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/recipes?page=${pageParam}&size=6`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Nepodařilo se připojit k serveru. Běží Spring Boot?');
        }
        return response.json();
      })
      .then((data: PageResponse<Recipe>) => {
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageParam]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

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
        if (pageData) {
            setPageData({
                ...pageData,
                content: pageData.content.filter((r) => r.id !== id)
            });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const currentUser = localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser') as string) : null;
  const recipes = pageData?.content || [];

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
        if (pageData) {
            setPageData({
                ...pageData,
                content: pageData.content.filter((r) => r.id !== id)
            });
        }
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

  const recipes = pageData?.content || [];

  // Hlavní vykreslení, když data úspěšně dorazí
  return (
    <>
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16 mt-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-[#2D2422] tracking-tight">Co dobrého dnes uvaříte?</h1>

        <div className="relative bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-full p-2 border border-[#F0EBE1] flex items-center mb-6 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
          <Search className="text-[#A39B95] ml-4" size={20} />
          <input
            type="text"
            placeholder="Najděte recept, ingredienci nebo autora..."
            className="flex-1 bg-transparent border-none px-4 py-3 focus:outline-none text-[#3A3331] text-lg placeholder:text-[#A39B95]"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition-colors">
            Hledat
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-1.5 bg-white border border-[#F0EBE1] text-[#5C534D] px-4 py-2 rounded-full text-sm font-medium hover:border-orange-300 hover:text-orange-600 shadow-sm transition-colors">
            <Clock size={16} /> Rychlovky do 30 min
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-[#F0EBE1] text-[#5C534D] px-4 py-2 rounded-full text-sm font-medium hover:border-orange-300 hover:text-orange-600 shadow-sm transition-colors">
            <Heart size={16} /> Nejoblíbenější
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#2D2422] mb-1">Právě uvařeno v komunitě</h2>
          <p className="text-[#7A726C] text-sm">Nejnovější recepty od ostatních kuchařů</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#7A726C] text-xl font-medium">Načítám recepty...</div>
      ) : recipes.length === 0 ? (
        <div className="p-12 text-center text-[#7A726C] text-lg">Zatím tu nejsou žádné recepty. Běž nějaký přidat!</div>
      ) : (
        <>
        {/* Grid rozdělí karty receptů do sloupců podle velikosti obrazovky */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-2xl border border-[#F0EBE1] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={getFallbackImage(recipe.id)} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-[#5C534D] rounded-full hover:bg-white hover:text-orange-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  <Bookmark size={18} />
                </button>
              </div>
              
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

        {/* Paginace */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pageData.pageNumber - 1)}
              disabled={pageData.pageNumber === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              Předchozí
            </button>

            <div className="flex gap-1">
              {[...Array(pageData.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    pageData.pageNumber === i
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pageData.pageNumber + 1)}
              disabled={pageData.isLast}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              Další
            </button>
          </div>
        )}
        </>
      )}
    </>
  );
}
