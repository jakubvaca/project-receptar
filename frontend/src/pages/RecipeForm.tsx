import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecipeForm() {
  const navigate = useNavigate(); // presmerovani po uspesnem odeslani receptu

  // base stavy
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // dynam pole
  const [ingredients, setIngredients] = useState([
    { name: '', amount: 0, unit: '' }
  ]);

  // stav po poslani
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // novy radek ingredience
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '' }]);
  };

  // smazani ingredience podle indexu (ktery se posila z buttonu)
  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  // zapis zmeny do pole ingredienci (ktery se posila z inputu)
  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  // odeslani formulaer
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault(); // zabraneni refreshi stranky
    setIsSubmitting(true);
    setError(null);

    // podle recipedto struktury
    const recipeData = {
      title: title,
      instructions: instructions,
      authorId: 1, // TODO: AZ SE PRIDAJI UZIVATELE NAHRADIT !!
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        amount: Number(ing.amount), // pro jistotu prevedeni na cislo
        unit: ing.unit
      }))
    };

    fetch('http://localhost:8080/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Chyba při ukládání receptu.');
        // 201 - OK prsmerovani na hlavni stranku
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
        
        {/* Recept nazev */}
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

        {/* ingredience */}
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
              {/* kdyz je vic nez 1 radek ukazeme button na mazani ingredience */}
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

        {/* Button na odeslani */}
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