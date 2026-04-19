import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, passwordHash: password, email }),
    });

    if (response.ok) {
      alert('Registrace pecka! Teď se přihlas.');
      navigate('/login');
    } else {
      alert('Něco se pokazilo, zkus jiný jméno.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <form onSubmit={handleRegister} className="p-10 bg-white shadow-2xl rounded-3xl w-96 border border-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Nová registrace</h2>
        <input type="text" placeholder="Uživatelské jméno" className="w-full p-3 mb-4 border rounded-xl" onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Tvůj email" className="w-full p-3 mb-4 border rounded-xl" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Heslo" className="w-full p-3 mb-8 border rounded-xl" onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-green-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-200">Zaregistrovat se</button>
      </form>
    </div>
  );
};

export default Register;