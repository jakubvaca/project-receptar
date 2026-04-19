import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Tady uložíme info o uživateli do paměti prohlížeče
                localStorage.setItem('loggedUser', JSON.stringify(data));
                alert('Vítej!');
                navigate('/'); // Skočíme na recepty
            } else {
                setError('Špatné jméno nebo heslo');
            }
        } catch {
  setError('Backend nejede.');
}
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-xl w-80">
                <h2 className="text-xl font-bold mb-4">Přihlášení</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input type="text" placeholder="Jméno" className="w-full border p-2 mb-2 rounded" 
                       onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Heslo" className="w-full border p-2 mb-4 rounded" 
                       onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-blue-500 text-white p-2 rounded">Vstoupit</button>
            </form>
        </div>
    );
};

export default Login;