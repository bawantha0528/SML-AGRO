import React, { useState } from 'react';

export function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            onLogin({ username, role: 'Admin' });
        } else if (username === 'user' && password === 'user') {
            onLogin({ username, role: 'User' });
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-sml-dark overflow-hidden">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/coconut-plantation-21901848.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3
                }}
            />

            <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10 border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-sml-dark">Admin Login</h2>
                    <p className="text-gray-500 mt-2">Sign in to manage SML Agro exports</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none transition-all"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none transition-all"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sml-green text-white font-bold py-3 rounded-lg hover:bg-sml-dark transition-colors shadow-md"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Demo Credentials: admin / admin</p>
                </div>
            </div>
        </div>
    );
}
