import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // 1. Koukneme se, jestli máme v paměti uloženého usera z Loginu
  const userString = localStorage.getItem('loggedUser');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Funkce pro odhlášení
  const handleLogout = () => {
    localStorage.removeItem('loggedUser'); // Smažeme usera z paměti
    navigate('/login'); // Hodíme ho na login
  };

  return (
    <nav className="bg-orange-500 p-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo a proklik na hlavní stranu */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-orange-100 transition">
            Receptář
        </Link>
        
        {/* Dynamické odkazy vpravo */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-orange-200 font-medium transition">
            Všechny recepty
          </Link>

          {user ? (
            /* VARIANTA: PŘIHLÁŠENÝ UŽIVATEL */
            <>
              <Link 
                to="/create" 
                className="bg-orange-600 px-4 py-2 rounded-lg font-bold shadow hover:bg-orange-700 transition"
              >
                + Přidat recept
              </Link>
              <div className="flex items-center gap-3 border-l border-orange-400 pl-4">
                <span className="text-sm font-medium italic">Ahoj, {user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-xs bg-orange-700 hover:bg-red-600 px-2 py-1 rounded transition"
                >
                  Odhlásit
                </button>
              </div>
            </>
          ) : (
            /* VARIANTA: NEPŘIHLÁŠENÝ UŽIVATEL */
            <>
              <Link to="/login" className="hover:text-orange-200 font-medium transition">
                Přihlásit
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold shadow hover:bg-orange-50 transition"
              >
                Registrace
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}