import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Přidaný import registrace

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFFDF9] font-sans text-[#3A3331] pb-24">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/create" element={<RecipeForm />} />
            <Route path="/edit/:id" element={<RecipeForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* <-- Nová cesta pro registraci */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;