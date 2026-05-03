import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); 
    setSuccessMsg('');

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Zadej platný e-mailový formát.');
      return;
    }
    
    if (password.length < 8) {
      setErrorMsg('Heslo musí mít alespoň 8 znaků.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwordHash: password, email }),
      });

      if (response.ok) {
        setSuccessMsg('Registrace se zdařila.');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Něco se pokazilo, zkus jiné jméno.');
      }
    } catch { 
      // TADY JE TA OPRAVA: Smazali jsme (err), protože ho nevyužíváme
      setErrorMsg('Chyba při komunikaci se serverem. Běží ti backend?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <form onSubmit={handleRegister} className="p-10 bg-white shadow-2xl rounded-3xl w-96 border border-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Nová registrace</h2>
        
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
          type="email" 
          placeholder="Tvůj email" 
          className="w-full p-3 mb-4 border rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Heslo (min. 8 znaků)" 
          className="w-full p-3 mb-8 border rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button className="w-full bg-green-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-200">
          Zaregistrovat se
        </button>
      </form>
    </div>
  );
};

export default Register;