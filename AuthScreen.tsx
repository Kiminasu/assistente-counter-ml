import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { USER_SIGNUP_RANKS } from './types';

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [rank, setRank] = useState('Guerreiro');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Cliente Supabase não inicializado. Verifique as credenciais.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                // 1. Sign up the user in the auth table
                const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                
                // 2. If sign up is successful, insert profile data into the 'profiles' table
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({ id: data.user.id, username, rank });

                    if (profileError) {
                        // If profile insertion fails, the auth user might have been created.
                        // For a real-world app, you might want to handle this more gracefully (e.g., delete the auth user).
                        // For now, we'll just show the error.
                        throw profileError;
                    }
                }

                setMessage('Cadastro realizado! Por favor, verifique seu e-mail para confirmar sua conta.');
            }
        } catch (error: any) {
            let friendlyError = error.error_description || error.message;
            if (typeof friendlyError === 'string' && friendlyError.includes('violates row-level security policy')) {
                friendlyError = "Erro de Segurança: Sua conta foi criada, mas não foi possível criar o perfil. Verifique as políticas de RLS (Row Level Security) no seu painel Supabase. Uma causa comum é a 'Confirmação de e-mail' estar ativa, o que impede que novos usuários sejam considerados 'autenticados' imediatamente.";
            }
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-48 mx-auto" />
                 <h1 className="text-4xl sm:text-5xl font-black tracking-tight title-main text-center -mt-8 relative">
                    MÍTICA ESTRATÉGIA
                </h1>
                
                <div className="glassmorphism p-8 rounded-2xl border-2 panel-glow-primary mt-8 animated-entry">
                    <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Entrar na sua Conta' : 'Criar Nova Conta'}</h2>
                    
                    {error && <p className="bg-red-500/30 text-red-300 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
                    {message && <p className="bg-green-500/30 text-green-300 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                             <>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nome de Usuário</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                        placeholder="Seu nickname"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rank" className="block text-sm font-medium text-gray-300">Seu Elo Atual</label>
                                    <select
                                        id="rank"
                                        value={rank}
                                        onChange={(e) => setRank(e.target.value)}
                                        required
                                        className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                    >
                                        {USER_SIGNUP_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                             </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-300">Senha (mínimo 6 caracteres)</label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 pr-10 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                                            <path d="M10 17.5c-4.478 0-8.268-2.943-9.542-7-1.274-4.057.065-8.357 3.328-10.745l1.414 1.414A8.025 8.025 0 001.958 10.5c1.274 4.057 5.064 7 9.542 7 1.145 0 2.24-.165 3.261-.478l-1.543-1.543A8.023 8.023 0 0110 17.5z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : isLogin ? 'Entrar' : 'Cadastrar'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="font-medium text-violet-400 hover:text-violet-300">
                            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;