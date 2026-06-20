import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMsg('Přihlášení úspěšné! Vítej zpět.');
        localStorage.setItem('loggedUser', JSON.stringify({
          username: data.username,
          userId: data.userId
        }));
        setTimeout(() => { navigate('/'); }, 1000);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Špatné jméno nebo heslo.');
      }
    } catch {
      setErrorMsg('Chyba při komunikaci se serverem. Běží ti backend?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form onSubmit={handleLogin} className="p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] w-full max-w-md border border-[#F0EBE1]">
        <div className="flex justify-center mb-6 text-orange-500">
            <ChefHat size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center text-[#2D2422]">Vítejte zpět</h2>
        
        {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{errorMsg}</div>}
        {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">{successMsg}</div>}

        <div className="space-y-4 mb-8">
            <div>
                <label className="block text-sm font-medium text-[#7A726C] mb-1.5 ml-1">Uživatelské jméno</label>
                <input
                type="text"
                className="w-full p-3.5 bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl outline-none focus:border-orange-300 focus:bg-white transition-all text-[#3A3331]"
                onChange={e => setUsername(e.target.value)}
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#7A726C] mb-1.5 ml-1">Heslo</label>
                <input
                type="password"
                className="w-full p-3.5 bg-[#F5F2EC]/50 border border-[#F0EBE1] rounded-xl outline-none focus:border-orange-300 focus:bg-white transition-all text-[#3A3331]"
                onChange={e => setPassword(e.target.value)}
                required
                />
            </div>
        </div>
        
        <button className="w-full bg-[#2D2422] text-white p-4 rounded-xl font-bold hover:bg-black transition-colors shadow-sm mb-6">
          Přihlásit se
        </button>
        
        <p className="text-center text-sm text-[#7A726C]">
          Nemáš ještě účet?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4">
            Zaregistruj se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
