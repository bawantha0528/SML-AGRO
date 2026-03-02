import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication for now
        if (username && password) {
            onLogin({ username, role: 'admin' });
        }
    };

    return (
        <div className="min-h-screen bg-sml-dark flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-sml-dark mb-2 tracking-wider">
                        SML <span className="text-sml-green">AGRO</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Admin Portal Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sml-green focus:border-sml-green outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sml-green focus:border-sml-green outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sml-green text-white p-3 rounded-lg font-bold hover:bg-sml-dark transition-colors tracking-wide"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
