import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// 1. Přesně definujeme, jak vypadá uživatel v paměti
interface UserData {
  username: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 2. Řekneme TypeScriptu, že 'user' je buď 'UserData', nebo 'null'
  const [user, setUser] = useState<UserData | null>(() => {
    const userString = localStorage.getItem('loggedUser');
    return userString ? (JSON.parse(userString) as UserData) : null;
  });

  // 3. Kdykoliv se změní URL adresa, zkontrolujeme paměť znovu
  useEffect(() => {
    // Tady jsme vytvořili malou funkci, abychom uklidnili ten přísný linter
    const checkAuth = () => {
      const userString = localStorage.getItem('loggedUser');
      setUser(userString ? (JSON.parse(userString) as UserData) : null);
    };
    checkAuth(); // A hned ji zavoláme
  }, [location]);

  // 4. Funkce pro odhlášení
  const handleLogout = () => {
    localStorage.removeItem('loggedUser'); // Smažeme usera z paměti
    setUser(null); // Okamžitě ho vymažeme i ze zobrazení v Navbaru
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