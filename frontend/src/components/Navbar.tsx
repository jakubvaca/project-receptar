import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-orange-500 p-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo a proklik na hlavní stranu */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-orange-100 transition">
            Receptář
        </Link>
        
        {/* Odkazy vpravo */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-orange-200 font-medium transition">
            Všechny recepty
          </Link>
          <Link 
            to="/create" 
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold shadow hover:bg-orange-50 transition"
          >
            + Přidat recept
          </Link>
        </div>
      </div>
    </nav>
  );
}