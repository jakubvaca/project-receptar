import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Recipe, PageResponse } from '../types';
import { Search, Clock, Heart, Star, Bookmark } from 'lucide-react';

export default function RecipeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 0;

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

  const currentUserString = localStorage.getItem('loggedUser');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const recipes = pageData?.content || [];

  if (error) {
    return <div className="p-8 text-center text-red-500 font-bold text-xl">Chyba: {error}</div>;
  }

  // --- HARDCODED FALLBACKS PRO CHYBĚJÍCÍ DATA Z API ---
  const defaultImage = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";
  const getFallbackImage = (id: number) => {
      const images = [
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
      ];
      return images[id % images.length] || defaultImage;
  };

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
        {/* Community Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-2xl border border-[#F0EBE1] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={getFallbackImage(recipe.id)} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-[#5C534D] rounded-full hover:bg-white hover:text-orange-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  <Bookmark size={18} />
                </button>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    {recipe.ingredients.length} surovin
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#5C534D]">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" /> {(4 + (recipe.id % 10) * 0.1).toFixed(1)}
                  </div>
                </div>

                <h3 className="font-bold text-[#2D2422] text-xl mb-4 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                  {recipe.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F0EBE1]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700 overflow-hidden">
                      {recipe.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#5C534D]">{recipe.authorName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#7A726C] bg-[#F5F2EC] px-2 py-1 rounded-md">
                    <Clock size={12} /> {30 + (recipe.id % 5)*10} min
                  </div>
                </div>

                {/* Admin Buttons for Author */}
                {currentUser && currentUser.username === recipe.authorName && (
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/edit/${recipe.id}`}
                      className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-[#5C534D] text-sm font-semibold py-2 px-3 rounded-lg transition"
                    >
                      Upravit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2 px-3 rounded-lg transition"
                    >
                      Smazat
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Paginace */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pageData.pageNumber - 1)}
              disabled={pageData.pageNumber === 0}
              className="px-4 py-2 bg-white border border-[#F0EBE1] text-[#5C534D] rounded-full hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-sm"
            >
              Předchozí
            </button>

            <div className="flex gap-1">
              {[...Array(pageData.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-10 h-10 rounded-full font-medium transition shadow-sm flex items-center justify-center ${
                    pageData.pageNumber === i
                      ? 'bg-[#2D2422] text-white'
                      : 'bg-white border border-[#F0EBE1] hover:border-orange-300 text-[#5C534D]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pageData.pageNumber + 1)}
              disabled={pageData.isLast}
              className="px-4 py-2 bg-white border border-[#F0EBE1] text-[#5C534D] rounded-full hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-sm"
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
