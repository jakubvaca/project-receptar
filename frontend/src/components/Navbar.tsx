import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';

interface UserData {
  username: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [user, setUser] = useState<UserData | null>(() => {
    const userString = localStorage.getItem('loggedUser');
    return userString ? (JSON.parse(userString) as UserData) : null;
  });

  useEffect(() => {
    const checkAuth = () => {
      const userString = localStorage.getItem('loggedUser');
      setUser(userString ? (JSON.parse(userString) as UserData) : null);
    };
    checkAuth();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#F0EBE1] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <ChefHat size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#2D2422]">Receptář</span>
          </Link>

          {/* Center Navigation - minimal */}
          <nav className="hidden md:flex gap-8 font-medium text-sm text-[#7A726C]">
            <Link to="/" className="hover:text-[#2D2422] transition-colors">Všechny recepty</Link>
            <button className="hover:text-[#2D2422] transition-colors">Inspirace</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/create" className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-[#2D2422] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-sm">
                  <span className="text-lg leading-none mb-0.5">+</span> Nový recept
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[#7A726C] hover:text-red-500 font-medium transition"
                  >
                    Odhlásit
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#7A726C] hover:text-[#2D2422] transition-colors">
                  Přihlásit
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-orange-500 text-white px-5 py-2.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                  Registrace
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
