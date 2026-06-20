import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Recipe } from '../types';

export default function RecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([
    { name: '', amount: 0, unit: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Načtení dat při editaci
  useEffect(() => {
    if (isEditing) {
      fetch('http://localhost:8080/api/recipes') // Pro jednoduchost načteme všechny a vyfiltrujeme, optimální by byl endpoint GET /api/recipes/{id}
        .then(res => res.json())
        .then((data: Recipe[]) => {
          const recipe = data.find(r => r.id === Number(id));
          if (recipe) {
            setTitle(recipe.title);
            setInstructions(recipe.instructions);
            if (recipe.ingredients && recipe.ingredients.length > 0) {
              setIngredients(recipe.ingredients.map(ing => ({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit
              })));
            }
          }
        })
        .catch(err => console.error("Chyba při načítání receptu", err));
    }
  }, [id, isEditing]);

  // Přidání nového řádku pro surovinu
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '' }]);
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const userStorage = localStorage.getItem('loggedUser'); 
    let authorId = null;
    if (userStorage) {
      try {
        const parsedUser = JSON.parse(userStorage);
        authorId = parsedUser.userId || null;
      } catch (err) {}
    }

    if (!authorId) {
      setError("Nejste přihlášen. Přihlaste se prosím znovu.");
      setIsSubmitting(false);
      return;
    }

    // 2. Příprava dat podle struktury backendového DTO
    // Odebíráme authorId, to si vyřeší backend sám ze session (SecurityContext)
    const recipeData = {
      title: title,
      instructions: instructions,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        amount: Number(ing.amount),
        unit: ing.unit
      }))
    };

    // 3. Získání CSRF tokenu z cookies
    const getCsrfToken = () => {
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
      return match ? match[2] : null;
    };

    const csrfToken = getCsrfToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Přidáme CSRF token do hlaviček, pokud existuje
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    }

    const endpoint = isEditing ? `http://localhost:8080/api/recipes/${id}` : 'http://localhost:8080/api/recipes';
    const httpMethod = isEditing ? 'PUT' : 'POST';

    // 4. Odeslání na server
    fetch(endpoint, {
      method: httpMethod,
      credentials: 'include', // Velmi důležité pro odeslání přihlašovací Cookie a čtení CSRF Cookie
      headers: headers,
      body: JSON.stringify(recipeData),
    })
      .then((response) => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Nemáte oprávnění. Vaše přihlášení pravděpodobně vypršelo, nebo nejste autorem receptu.');
            }
            throw new Error('Chyba při ukládání receptu na server.');
        }
        navigate('/'); 
      })
      .catch((err) => {
        setError(err.message);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
        {isEditing ? 'Upravit recept' : 'Vytvořit nový recept'}
      </h1>
      
      {error && <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div>
          <label className="block text-sm font-medium text-[#7A726C] mb-2 ml-1">Název receptu</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl p-4 focus:bg-white focus:border-orange-300 outline-none transition-all text-[#3A3331] text-lg font-medium placeholder:text-[#A39B95] placeholder:font-normal"
            placeholder="Např. Krémové rizoto s hříbky"
          />
        </div>

        <div className="pt-4 border-t border-[#F0EBE1]">
          <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-[#7A726C] ml-1">Suroviny</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-sm bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
              >
                <Plus size={16} /> Přidat
              </button>
          </div>
          <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Název (např. Rýže Arborio)"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="flex-[2] bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl p-3 focus:bg-white focus:border-orange-300 outline-none transition-all text-[#3A3331]"
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="Množ."
                    value={ingredient.amount || ''}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    className="flex-[1] min-w-[80px] bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl p-3 focus:bg-white focus:border-orange-300 outline-none transition-all text-[#3A3331]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Jednotka (např. g)"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="flex-[1] min-w-[80px] bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl p-3 focus:bg-white focus:border-orange-300 outline-none transition-all text-[#3A3331]"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EBE1]">
          <label className="block text-sm font-medium text-[#7A726C] mb-2 ml-1">Postup přípravy</label>
          <textarea 
            required
            rows={6}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl p-4 focus:bg-white focus:border-orange-300 outline-none transition-all text-[#3A3331] leading-relaxed resize-y placeholder:text-[#A39B95]"
            placeholder="Krok za krokem popište, jak uvařit toto skvělé jídlo..."
          />
        </div>

        {/* Tlačítko na odeslání */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {isSubmitting ? 'Ukládám...' : (isEditing ? 'Aktualizovat recept' : 'Uložit recept')}
        </button>
      </form>
    </div>
  );
}
