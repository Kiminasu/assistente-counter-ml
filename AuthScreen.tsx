import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { USER_SIGNUP_RANKS } from './types';

interface AuthScreenProps {
    onGoBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onGoBack }) => {
    const [authView, setAuthView] = useState<'login' | 'signup' | 'forgotPassword' | 'updatePassword'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [rank, setRank] = useState('Guerreiro');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      // Verifica se o URL contém o hash de recuperação de senha do Supabase
      if (window.location.hash.includes('type=recovery')) {
        setAuthView('updatePassword');
        setMessage('Você está recuperando sua senha. Por favor, insira uma nova senha.');
      }
    }, []);

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
            if (authView === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // A navegação ocorrerá automaticamente via listener no App.tsx
            } else if (authView === 'signup') {
                const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({ id: data.user.id, username, rank });
                    if (profileError) throw profileError;
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

    const handlePasswordReset = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Cliente Supabase não inicializado.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin, // Redireciona de volta para a mesma página
            });
            if (error) throw error;
            setMessage('Um link para redefinir sua senha foi enviado para o seu e-mail.');
        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Cliente Supabase não inicializado.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage('Senha alterada com sucesso! Você já pode fazer o login.');
            setPassword('');
            // Remove o hash da URL para limpar o estado de recuperação
            window.history.replaceState(null, '', window.location.pathname);
            setTimeout(() => setAuthView('login'), 2000);
        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderFormContent = () => {
        switch (authView) {
            case 'forgotPassword':
                return (
                    <>
                        <h2 className="text-xl font-bold text-center mb-4">Recuperar Senha</h2>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                                <label htmlFor="email-reset" className="block text-sm font-medium text-gray-300">E-mail</label>
                                <input id="email-reset" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="seu@email.com" />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all">
                                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-6 text-center text-sm">
                            <button onClick={() => { setAuthView('login'); setError(null); setMessage(null); }} className="font-medium text-sky-400 hover:text-sky-300">
                                Voltar para o login
                            </button>
                        </p>
                    </>
                );
            case 'updatePassword':
                return (
                    <>
                        <h2 className="text-xl font-bold text-center mb-4">Criar Nova Senha</h2>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label htmlFor="password-update" className="block text-sm font-medium text-gray-300">Nova Senha (mínimo 6 caracteres)</label>
                                <input id="password-update" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="••••••••" />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all">
                                    {loading ? 'Salvando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        </form>
                    </>
                );
            case 'login':
            case 'signup':
            default:
                const isLogin = authView === 'login';
                return (
                    <>
                        <h2 className="text-xl font-bold text-center mb-4">{isLogin ? 'Faça Login para Continuar' : 'Criar Nova Conta'}</h2>
                        <form onSubmit={handleAuth} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div>
                                        <label htmlFor="username-modal" className="block text-sm font-medium text-gray-300">Nome de Usuário</label>
                                        <input id="username-modal" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Seu nickname" />
                                    </div>
                                    <div>
                                        <label htmlFor="rank-modal" className="block text-sm font-medium text-gray-300">Seu Elo Atual</label>
                                        <select id="rank-modal" value={rank} onChange={(e) => setRank(e.target.value)} required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                                            {USER_SIGNUP_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div>
                                <label htmlFor="email-modal" className="block text-sm font-medium text-gray-300">E-mail</label>
                                <input id="email-modal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="seu@email.com" />
                            </div>

                            <div>
                                <label htmlFor="password-modal" className="block text-sm font-medium text-gray-300">Senha (mínimo 6 caracteres)</label>
                                <div className="relative mt-1">
                                    <input id="password-modal" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 pr-10 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /><path d="M10 17.5c-4.478 0-8.268-2.943-9.542-7-1.274-4.057.065-8.357 3.328-10.745l1.414 1.414A8.025 8.025 0 001.958 10.5c1.274 4.057 5.064 7 9.542 7 1.145 0 2.24-.165 3.261-.478l-1.543-1.543A8.023 8.023 0 0110 17.5z" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all">
                                    {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : isLogin ? 'Entrar' : 'Cadastrar'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 flex flex-col items-center gap-4 text-sm">
                             {isLogin && (
                                <button onClick={() => { setAuthView('forgotPassword'); setError(null); setMessage(null); }} className="font-medium text-sky-400 hover:text-sky-300">
                                    Esqueci minha senha
                                </button>
                            )}
                            <button onClick={() => { setAuthView(isLogin ? 'signup' : 'login'); setError(null); setMessage(null); }} className="font-medium text-sky-400 hover:text-sky-300">
                                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                            </button>
                        </div>
                    </>
                );
        }
    };


    return (
        <div className="min-h-screen flex flex-col animated-entry">
             <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-md border-b border-slate-700/50">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button 
                            onClick={onGoBack} 
                            className="text-slate-300 hover:text-white font-semibold transition-colors text-lg p-2 rounded-lg flex items-center gap-2"
                            aria-label="Voltar para a página inicial"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:block">Voltar</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="animated-border-glow rounded-2xl">
                        <div className="login-panel-solid p-8 rounded-[14px] relative">
                            <div className="flex flex-col items-center mb-6">
                                <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia Logo" className="h-20" />
                                <h1 className="text-xl font-bold tracking-tight text-white text-center mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Mítica Estratégia MLBB
                                </h1>
                            </div>
                            
                            {error && <p className="bg-red-500/30 text-red-300 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
                            {message && <p className="bg-green-500/30 text-green-300 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}

                            {renderFormContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuthScreen;