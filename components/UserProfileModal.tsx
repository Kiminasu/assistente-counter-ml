import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { USER_SIGNUP_RANKS, UserSignupRank } from '../types';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: UserProfile;
    userId: string;
    onProfileUpdate: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userProfile, userId, onProfileUpdate }) => {
    const [username, setUsername] = useState(userProfile.username);
    const [rank, setRank] = useState<UserSignupRank>(userProfile.rank);
    const [phone, setPhone] = useState(userProfile.phone || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setUsername(userProfile.username);
            setRank(userProfile.rank);
            setPhone(userProfile.phone || '');
            setError(null);
            setMessage(null);
        }
    }, [isOpen, userProfile]);

    const handleSave = async (event: React.FormEvent) => {
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
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ username, rank, phone })
                .eq('id', userId);

            if (updateError) throw updateError;
            
            setMessage("Perfil atualizado com sucesso!");
            onProfileUpdate(); // Notifica o App.tsx para buscar os dados novamente

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error: any) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glassmorphism rounded-2xl shadow-xl max-w-md w-full flex flex-col border border-violet-500 modal-animation">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Perfil</h2>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    {error && <p className="bg-red-500/30 text-red-300 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
                    {message && <p className="bg-green-500/30 text-green-300 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nome de Usuário</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="rank" className="block text-sm font-medium text-gray-300">Seu Elo Atual</label>
                            <select
                                id="rank"
                                value={rank}
                                onChange={(e) => setRank(e.target.value as UserSignupRank)}
                                required
                                className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                            >
                                {USER_SIGNUP_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="phone-profile" className="block text-sm font-medium text-gray-300">Telefone</label>
                            <input
                                id="phone-profile"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                placeholder="(XX) XXXXX-XXXX"
                            />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                             <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors">Cancelar</button>
                             <button
                                type="submit"
                                disabled={loading}
                                className="py-2 px-4 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;