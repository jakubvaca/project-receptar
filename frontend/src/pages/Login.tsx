import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend v LoginRequestDto očekává username a password
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Backend vrací AuthResponseDto
        setSuccessMsg('Přihlášení úspěšné! Vítej zpět.');
        
        // Uložíme si jméno uživatele do paměti prohlížeče
        localStorage.setItem('currentUser', data.username);
        
        // Za vteřinu ho hodíme na hlavní stránku s recepty
        setTimeout(() => {
          navigate('/');
        }, 1000);
        
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Špatné jméno nebo heslo.');
      }
    } catch {
      setErrorMsg('Chyba při komunikaci se serverem. Běží ti backend?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <form onSubmit={handleLogin} className="p-10 bg-white shadow-2xl rounded-3xl w-96 border border-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Přihlášení</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm border border-green-200">
            {successMsg}
          </div>
        )}

        <input 
          type="text" 
          placeholder="Uživatelské jméno" 
          className="w-full p-3 mb-4 border rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Heslo" 
          className="w-full p-3 mb-8 border rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold text-lg hover:bg-slate-900 transition shadow-lg shadow-slate-200 mb-4">
          Přihlásit se
        </button>
        
        <p className="text-center text-sm text-slate-500">
          Nemáš ještě účet?{' '}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Zaregistruj se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;