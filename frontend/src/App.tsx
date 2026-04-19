import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Přidaný import registrace

function App() {
  return (
    <BrowserRouter>
      {/* min-h-screen roztáhne šedé pozadí až úplně dolů */}
      <div className="min-h-screen bg-slate-50"> 
        <Navbar />
        
        {/* container zabrání tomu, aby byl text nalepený na okrajích monitoru */}
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/create" element={<RecipeForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* <-- Nová cesta pro registraci */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;