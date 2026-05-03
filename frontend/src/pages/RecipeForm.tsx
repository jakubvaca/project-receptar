import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecipeForm() {
  const navigate = useNavigate();

  // Základní stavy
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Dynamické pole pro suroviny
  const [ingredients, setIngredients] = useState([
    { name: '', amount: 0, unit: '' }
  ]);

  // Stavy pro odesílání a chyby
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Přidání nového řádku pro surovinu
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '' }]);
  };

  // Smazání suroviny podle indexu
  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  // Zápis změny do pole surovin
  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  // Odeslání formuláře
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 1. Získání dat uživatele (hlavně userId) z localStorage
    const userStorage = localStorage.getItem('loggedUser'); 
    let authorId = null;

    if (userStorage) {
      try {
        const parsedUser = JSON.parse(userStorage);
        authorId = parsedUser.userId || null;
      } catch (err) {
        console.error("Chyba při parsování dat z localStorage", err);
      }
    }

    if (!authorId) {
      setError("Nejste přihlášen, nebo chybí ID uživatele. Přihlaste se prosím znovu.");
      setIsSubmitting(false);
      return;
    }

    // 2. Příprava dat podle struktury backendového DTO
    const recipeData = {
      title: title,
      instructions: instructions,
      authorId: authorId, 
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        amount: Number(ing.amount), // pro jistotu převedení na číslo
        unit: ing.unit
      }))
    };

    // 3. Odeslání na server
    fetch('http://localhost:8080/api/recipes', {
      method: 'POST',
      credentials: 'include', // Velmi důležité pro odeslání přihlašovací Cookie
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Nemáte oprávnění přidat recept. Vaše přihlášení pravděpodobně vypršelo.');
            }
            throw new Error('Chyba při ukládání receptu na server.');
        }
        // 201 Created - přesměrování na hlavní stránku
        navigate('/'); 
      })
      .catch((err) => {
        setError(err.message);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Vytvořit nový recept</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Název receptu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název receptu</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Např. Špagety Carbonara"
          />
        </div>

        {/* Suroviny */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suroviny</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input 
                type="text" 
                required
                placeholder="Název (např. Mouka)"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className="flex-2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none w-full"
              />
              <input 
                type="number" 
                required
                min="0"
                step="0.1"
                placeholder="Množství"
                value={ingredient.amount || ''}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none w-24"
              />
              <input 
                type="text" 
                required
                placeholder="Jednotka (např. g)"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none w-24"
              />
              {/* Pokud je více než 1 řádek, ukážeme tlačítko na smazání suroviny */}
              {ingredients.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveIngredient(index)}
                  className="bg-red-100 text-red-600 px-3 py-2 rounded-lg font-bold hover:bg-red-200"
                >
                  X
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={handleAddIngredient}
            className="mt-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200"
          >
            + Přidat další surovinu
          </button>
        </div>

        {/* Postup */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postup přípravy</label>
          <textarea 
            required
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Popište, jak jídlo uvařit..."
          />
        </div>

        {/* Tlačítko na odeslání */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {isSubmitting ? 'Ukládám...' : 'Uložit recept'}
        </button>
      </form>
    </div>
  );
}